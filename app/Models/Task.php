<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'due_date',
        'order',
        'priority',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function folders()
    {
        return $this->belongsToMany(Folder::class)->withPivot('order');
    }
}
