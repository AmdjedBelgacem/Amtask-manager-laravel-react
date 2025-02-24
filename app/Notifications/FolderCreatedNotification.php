<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FolderCreatedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

    protected $folder;

    public function __construct($folder)
    {
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
            ->subject('Folder Created: ' . $this->folder->name)
            ->line('A new folder has been created: ' . $this->folder->name)
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
