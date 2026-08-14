<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScanHistory extends Model
{
    use HasFactory;

    protected $table = 'scan_histories';

    protected $fillable = [
        'user_id',
        'scan_type',
        'target',
        'verdict',
        'risk_score',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
        'risk_score' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
