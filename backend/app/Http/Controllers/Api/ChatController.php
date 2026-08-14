<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        $message = strtolower($request->message);

        if (str_contains($message, 'whatsapp') || str_contains($message, 'hack')) {
            $reply = "To secure your WhatsApp:\n1. Open WhatsApp Settings > Account > Two-Step Verification > Enable.\n2. Set a 6-digit PIN and recovery email.\n3. Never share your 6-digit SMS registration code with anyone.\n4. Audit Linked Devices regularly.";
        } elseif (str_contains($message, 'bvn') || str_contains($message, 'otp')) {
            $reply = "Critical Security Warning: No Nigerian bank, Central Bank of Nigeria (CBN), or telecommunications provider will ever request your BVN, Debit Card PIN, or OTP.\nAlways verify with your bank branch directly.";
        } elseif (str_contains($message, 'sim') || str_contains($message, 'swap')) {
            $reply = "SIM Swap Protection:\nIf your phone suddenly loses cellular signal and cannot make calls in known good areas, immediately phone your mobile operator from another line to freeze the SIM and inform your bank to lock USSD banking.";
        } else {
            $reply = "I analyzed your query: \"{$request->message}\". In Nigeria's digital space, always verify unprompted transfer requests by voice calling the contact directly. Avoid shortened URLs.";
        }

        return response()->json([
            'reply' => $reply,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function starters()
    {
        return response()->json([
            'How do I secure my WhatsApp?',
            'How do scammers steal bank accounts in Nigeria?',
            'What is a SIM swap attack?',
            'How do I avoid fake BVN texts?',
        ]);
    }
}
