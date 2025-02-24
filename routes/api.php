<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\FolderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Notifications\UserUpgradedToPremiumNotification;

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/folders/{folder}/reorder-tasks', [FolderController::class, 'reorderTasks']);
    Route::put('/tasks/reorder', [TaskController::class, 'reorder']);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('folders', FolderController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::post('/folders/{folder}/add-task', [FolderController::class, 'addTask']);
    Route::delete('/folders/{folder}/remove-task/{task}', [FolderController::class, 'removeTask']);
    Route::get('/folders/{folder}/tasks', [FolderController::class, 'tasks']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/activate-premium', function (Request $request) {
        $user = $request->user();
        $user->is_premium = true;
        $result = $user->save();

        if (!$result) {
            return response()->json(['message' => 'Failed to update user'], 500);
        }

        $user->notify(new UserUpgradedToPremiumNotification());

        $updatedUser = User::find($user->id);

        return response()->json([
            'message' => 'User updated successfully',
            'is_premium' => $updatedUser->is_premium,
        ]);
    });

    Route::get('/tasks/priority', [TaskController::class, 'priorityTasks']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
