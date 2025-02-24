<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TaskCreatedNotification extends Notification
{
    use Queueable;

    /**
     * The task instance.
     *
     * @var object
     */
    protected $task;

    /**
     * Create a new notification instance.
     *
     * @param object $task
     */
    public function __construct($task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */    public function toMail(object $notifiable): MailMessage
    {
        Log::info('Sending email to: ' . $notifiable->email);
        return (new MailMessage)
            ->subject('New Task Created: ' . $this->task->title)
            ->line('A new task has been created.')
            ->line('Task Title: ' . $this->task->title)
            ->line('Task Description: ' . $this->task->description)
            ->line('Task Status: ' . $this->task->status)
            ->line('Task Due Date: ' . $this->task->due_date)
            ->action('View Tasks', url('/tasks'))
            ->line('Kindly visit task manager app to interact with your task!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
