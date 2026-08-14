<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json([
            [
                'id' => 'r1',
                'title' => 'Weekly Threat Intelligence Brief',
                'risk' => 'Low',
                'date' => '14 Aug 2026',
                'items' => '91 threats blocked · 0 breaches',
            ],
            [
                'id' => 'r2',
                'title' => 'Lagos Phishing Surge Assessment',
                'risk' => 'High',
                'date' => '10 Aug 2026',
                'items' => '128 lures intercepted · SMS vector',
            ],
            [
                'id' => 'r3',
                'title' => 'Enterprise Mailbox Hygiene Audit',
                'risk' => 'Medium',
                'date' => '03 Aug 2026',
                'items' => '2 weak passphrases flagged',
            ],
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'id' => $id,
            'title' => 'Weekly Threat Intelligence Brief',
            'status' => 'Normal / Low Risk',
            'date' => '14 Aug 2026',
            'summary' => 'During the last 7-day reporting cycle, Sentinel intercepted 91 unauthorized authentication lures. The dominant vector was spoofed banking KYC messages via SMS and WhatsApp.',
            'metrics' => [
                'blocked' => 91,
                'health_score' => '86%',
                'takeovers' => 0,
            ],
            'recommendations' => [
                'Enforce mandatory hardware or app-based 2FA across corporate email domains.',
                'Conduct quarterly SIM-swap response drills for authorized bank signatories.',
                'Distribute the Sentinel Cyber Academy Phishing module to all remote staff.',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['title' => 'required|string']);

        return response()->json([
            'message' => 'Executive threat brief compiled successfully.',
            'id' => 'r_' . time(),
        ], 201);
    }

    public function exportPdf($id)
    {
        return response()->json([
            'message' => 'PDF generated and ready for stream download.',
            'download_url' => url("/api/reports/{$id}/download.pdf"),
        ]);
    }
}
