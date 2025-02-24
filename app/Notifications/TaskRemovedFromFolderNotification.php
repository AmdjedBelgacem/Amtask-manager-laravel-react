<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskRemovedFromFolderNotification extends Notification
{
    use Queueable;


    protected $task;
    protected $folder;
    /**
     * Create a new notification instance.
     */
    public function __construct($task, $folder)
    {
        $this->task = $task;
        $this->folder = $folder;
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
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Task Removed from Folder: ' . $this->task->title)
            ->line('A task has been removed from the folder: ' . $this->folder->name)
            ->line('Task Title: ' . $this->task->title)
            ->line('Task Description: ' . $this->task->description)
            ->action('View Folder', url('/folders/' . $this->folder->id))
            ->line('Thank you for using our application!');
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
