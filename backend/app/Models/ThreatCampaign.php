<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreatCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'severity',
        'category',
        'region',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
