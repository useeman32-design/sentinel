import 'package:flutter/material.dart';
import '../theme.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final reports = [
      ('Weekly Threat Intelligence Brief', 'Low', '14 Aug 2026', '91 threats blocked · 0 breaches'),
      ('Lagos Phishing Surge Assessment', 'High', '10 Aug 2026', '128 lures intercepted · SMS vector'),
      ('Enterprise Mailbox Hygiene Audit', 'Medium', '03 Aug 2026', '2 weak passphrases flagged'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Executive Reports')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Text('GENERATED BRIEFINGS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2, color: Colors.white70)),
          const SizedBox(height: 10),
          for (final r in reports)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              child: Card(
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ReportDetailScreen(title: r.$1, date: r.$3))),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text(r.$1, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14))),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: r.$2 == 'High'
                                    ? SentinelTheme.danger.withValues(alpha: 0.15)
                                    : r.$2 == 'Medium'
                                        ? SentinelTheme.warn.withValues(alpha: 0.15)
                                        : SentinelTheme.green.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                '${r.$2} Risk',
                                style: TextStyle(
                                  color: r.$2 == 'High'
                                      ? SentinelTheme.danger
                                      : r.$2 == 'Medium'
                                          ? SentinelTheme.warn
                                          : SentinelTheme.green,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(r.$4, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12)),
                        const SizedBox(height: 6),
                        Text(r.$3, style: const TextStyle(color: Colors.white38, fontSize: 10)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class ReportDetailScreen extends StatelessWidget {
  final String title;
  final String date;
  const ReportDetailScreen({super.key, required this.title, required this.date});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Briefing Summary')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: SentinelTheme.green.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text('Status · Low Risk', style: TextStyle(color: SentinelTheme.green, fontWeight: FontWeight.w800, fontSize: 11)),
                      ),
                      Text(date, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                  const SizedBox(height: 8),
                  const Text(
                    'During the current reporting cycle, Sentinel intercepted 91 unauthorized authentication lures and phishing attempts. The dominant vector was spoofed banking KYC messages via SMS and WhatsApp.',
                    style: TextStyle(fontSize: 13, height: 1.5, color: Colors.white70),
                  ),
                  const SizedBox(height: 16),
                  const Text('KEY METRICS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _MetricBox('91', 'Blocked', SentinelTheme.blue),
                      const SizedBox(width: 8),
                      _MetricBox('86%', 'Health', SentinelTheme.green),
                      const SizedBox(width: 8),
                      _MetricBox('0', 'Takeovers', SentinelTheme.warn),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('RECOMMENDATIONS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2)),
                  const SizedBox(height: 6),
                  const Text('• Enforce 2FA across corporate email domains.', style: TextStyle(fontSize: 12, color: Colors.white70)),
                  const Text('• Conduct quarterly SIM-swap response drills.', style: TextStyle(fontSize: 12, color: Colors.white70)),
                  const Text('• Distribute Cyber Academy Phishing module.', style: TextStyle(fontSize: 12, color: Colors.white70)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),
          FilledButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Executive PDF Briefing downloaded!')),
              );
            },
            icon: const Icon(Icons.picture_as_pdf),
            label: const Text('Export Executive PDF'),
          ),
        ],
      ),
    );
  }

  Widget _MetricBox(String val, String label, Color c) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(color: SentinelTheme.surfaceDark2, borderRadius: BorderRadius.circular(12)),
        child: Column(
          children: [
            Text(val, style: TextStyle(color: c, fontWeight: FontWeight.w800, fontSize: 18)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 10, color: Colors.white60)),
          ],
        ),
      ),
    );
  }
}
