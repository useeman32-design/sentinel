<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreatReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'risk_level',
        'summary',
        'metrics',
        'recommendations',
    ];

    protected $casts = [
        'metrics' => 'array',
        'recommendations' => 'array',
    ];
}
