<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Notifications\TaskCreatedNotification;
use App\Notifications\TaskDeletedNotification;
use App\Notifications\TaskUpdatedNotification;
use Illuminate\Support\Facades\Log;


class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = Auth::user()->tasks()->orderBy('order');
    
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }
    
        if ($request->has('priority')) {
            $query->where('priority', true);
        }
    
        $tasks = $query->paginate(10);
    
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|boolean',
        ]);

        $taskData = [
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
            'due_date' => $request->due_date,
            'order' => Auth::user()->tasks()->count(),
        ];

        if (Auth::user()->is_premium) {
            $taskData['priority'] = $request->priority ?? false;
        } else {
            $taskData['priority'] = false;
        }

        $task = Auth::user()->tasks()->create($taskData);

        Auth::user()->notify(new TaskCreatedNotification($task));

        return response()->json($task, 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,completed',
            'due_date' => 'nullable|date',
            'order' => 'sometimes|integer',
            'priority' => 'sometimes|boolean',
        ]);

        $taskData = $request->only(['title', 'description', 'status', 'due_date', 'order']);

        if (Auth::user()->is_premium) {
            $taskData['priority'] = $request->priority ?? false;
        } else {
            $taskData['priority'] = false;
        }

        $task->update($taskData);

        Auth::user()->notify(new TaskUpdatedNotification($task));

        return response()->json($task);
    }


    public function reorder(Request $request)
    {
        Log::info('Reorder request received:', $request->all());

        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.order' => 'required|integer',
        ]);

        $tasks = $request->tasks;

        foreach ($tasks as $taskData) {
            Task::where('id', $taskData['id'])->update([
                'order' => $taskData['order'],
            ]);
        }

        return response()->json(['message' => 'Tasks reordered successfully']);
    }

    public function priorityTasks(Request $request)
    {
        $tasks = Auth::user()->tasks()->where('priority', true)->get();
        return response()->json($tasks);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Auth::user()->notify(new TaskDeletedNotification($task));

        $task->delete();
        return response()->json(null, 204);
    }
}
