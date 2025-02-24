<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\TaskAddedToFolderNotification;
use App\Notifications\TaskRemovedFromFolderNotification;
use App\Notifications\FolderCreatedNotification;
use App\Notifications\FolderDeletedNotification;


class FolderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $folders = Folder::where('user_id', $user->id)->get();
        return response()->json($folders);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user->is_premium) {
            return response()->json(['message' => 'This feature is only available for premium users.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder = Folder::create([
            'user_id' => $user->id,
            'name' => $request->name,
        ]);

        $user->notify(new FolderCreatedNotification($folder));

        return response()->json($folder, 201);
    }

    public function show(Folder $folder)
    {
        $user = Auth::user();

        if ($folder->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($folder);
    }

    public function addTask(Request $request, Folder $folder)
    {
        $user = Auth::user();
        if ($folder->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'task_id' => 'required|exists:tasks,id',
        ]);

        $task = Task::find($request->task_id);

        try {
            $folder->tasks()->attach($task->id, ['order' => $folder->tasks()->count()]);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json(['message' => 'Task is already in the folder.'], 400);
        }

        $user->notify(new TaskAddedToFolderNotification($task, $folder));

        return response()->json(['message' => 'Task added to folder successfully.']);
    }
    public function removeTask(Folder $folder, Task $task)
    {
        $user = Auth::user();

        if ($folder->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $folder->tasks()->detach($task->id);
        $user->notify(new TaskRemovedFromFolderNotification($task, $folder));

        return response()->json(['message' => 'Task removed from folder successfully.']);
    }

    public function reorderTasks(Request $request, Folder $folder)
    {
        $user = Auth::user();

        if ($folder->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:tasks,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($request->orders as $taskData) {
            $folder->tasks()->updateExistingPivot($taskData['id'], [
                'order' => $taskData['order'],
            ]);
        }

        return response()->json(['message' => 'Tasks reordered successfully.']);
    }



    public function tasks(Folder $folder, Request $request)
    {
        $user = Auth::user();

        if ($folder->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $search = $request->query('search');
        $query = $folder->tasks()->orderBy('order', 'asc');

        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $tasks = $query->paginate(10);

        return response()->json($tasks);
    }


    public function destroy(Folder $folder)
    {
        $user = Auth::user();

        if ($folder->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->notify(new FolderDeletedNotification($folder));

        $folder->delete();

        return response()->json(['message' => 'Folder deleted successfully.']);
    }
}
