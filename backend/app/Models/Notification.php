<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'kind',
        'title',
        'body',
        'tone',
        'seen',
    ];

    protected $casts = [
        'seen' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
