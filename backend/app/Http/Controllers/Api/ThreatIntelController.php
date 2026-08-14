<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ThreatIntelController extends Controller
{
    public function campaigns()
    {
        return response()->json([
            [
                'title' => 'Fake CBN BVN Recertification SMS Surge',
                'severity' => 'Critical',
                'category' => 'Phishing',
                'region' => 'Nigeria (Lagos / Abuja)',
                'description' => 'Attackers spoofing CBN shortcodes claiming accounts will be locked unless an unverified KYC link is clicked.',
                'time' => '12m ago',
            ],
            [
                'title' => 'WhatsApp “Family Emergency” Mule Ring',
                'severity' => 'Critical',
                'category' => 'Social Engineering',
                'region' => 'West Africa',
                'description' => 'Compromised WhatsApp accounts sending urgent audio clips demanding instant emergency transfers.',
                'time' => '45m ago',
            ],
            [
                'title' => 'Malicious APK Posing as Opay & PalmPay Updates',
                'severity' => 'Critical',
                'category' => 'Android Banking Trojan',
                'region' => 'Telegram Channels',
                'description' => 'Trojanized APKs requesting accessibility permissions to intercept OTP authentication tokens.',
                'time' => '2h ago',
            ],
            [
                'title' => 'Pig-Butchering Crypto Romance Syndicates',
                'severity' => 'High',
                'category' => 'Financial Fraud',
                'region' => 'Regional',
                'description' => 'Targeted dating app lures redirecting victims to fraudulent synthetic trading portals.',
                'time' => '4h ago',
            ],
            [
                'title' => 'Microsoft 365 MFA Push Fatigue Attack',
                'severity' => 'Medium',
                'category' => 'Account Takeover',
                'region' => 'Corporate / Global',
                'description' => 'Repeated multi-factor push notifications sent during late hours until approved.',
                'time' => '8h ago',
            ],
        ]);
    }

    public function statistics()
    {
        return response()->json([
            'security_score' => 86,
            'threats_detected' => 128,
            'scams_blocked' => 91,
            'intercept_rate' => '71%',
            'active_campaigns_24h' => 17,
            'critical_threats' => 4,
        ]);
    }

    public function news()
    {
        return response()->json([
            ['tag' => 'NG', 'title' => 'Fake CBN BVN recertification texts spike in Lagos', 'time' => '32m ago'],
            ['tag' => 'WA', 'title' => 'WhatsApp “family emergency” mule network active', 'time' => '2h ago'],
            ['tag' => 'APK', 'title' => 'Counterfeit Opay update circulating on Telegram', 'time' => '5h ago'],
        ]);
    }
}
