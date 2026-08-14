<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ScanController;
use App\Http\Controllers\Api\ThreatIntelController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ChatController;

/*
|--------------------------------------------------------------------------
| Sentinel AI API Routes
|--------------------------------------------------------------------------
*/

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'Sentinel AI Laravel API',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-code', [AuthController::class, 'verifyCode']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// Threat Scanner Routes (Open & Authenticated)
Route::prefix('scan')->group(function () {
    Route::post('/link', [ScanController::class, 'scanLink']);
    Route::post('/sms', [ScanController::class, 'scanSms']);
    Route::post('/email', [ScanController::class, 'scanEmail']);
    Route::post('/qr', [ScanController::class, 'scanQr']);
    Route::post('/file', [ScanController::class, 'scanFile']);
    Route::post('/password', [ScanController::class, 'checkPassword']);
    Route::post('/breach', [ScanController::class, 'checkBreach']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/history', [ScanController::class, 'history']);
        Route::get('/history/{id}', [ScanController::class, 'historyItem']);
    });
});

// AI Advisor Chat Routes
Route::prefix('chat')->group(function () {
    Route::post('/ask', [ChatController::class, 'ask']);
    Route::get('/starters', [ChatController::class, 'starters']);
});

// Threat Intelligence Desk Routes
Route::prefix('intel')->group(function () {
    Route::get('/campaigns', [ThreatIntelController::class, 'campaigns']);
    Route::get('/stats', [ThreatIntelController::class, 'statistics']);
    Route::get('/news', [ThreatIntelController::class, 'news']);
});

// Executive Reports Routes
Route::prefix('reports')->group(function () {
    Route::get('/', [ReportController::class, 'index']);
    Route::get('/{id}', [ReportController::class, 'show']);
    Route::post('/', [ReportController::class, 'store']);
    Route::get('/{id}/export-pdf', [ReportController::class, 'exportPdf']);
});
