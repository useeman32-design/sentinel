import 'package:flutter/material.dart';
import '../models/threat.dart';
import '../theme.dart';

class IntelScreen extends StatelessWidget {
  const IntelScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final campaigns = [
      const ThreatCampaign(
        title: 'Fake CBN BVN Recertification SMS Surge',
        severity: 'Critical',
        category: 'Phishing',
        region: 'Nigeria (Lagos / Abuja)',
        description: 'Attackers spoofing CBN shortcodes claiming bank accounts will be closed unless unverified links are opened.',
        time: '12m ago',
      ),
      const ThreatCampaign(
        title: 'WhatsApp “Family Emergency” Mule Ring',
        severity: 'Critical',
        category: 'Social Engineering',
        region: 'West Africa',
        description: 'Compromised accounts sending urgent voice notes to family contacts requesting emergency airtime or bank transfer.',
        time: '45m ago',
      ),
      const ThreatCampaign(
        title: 'Trojanized APK Posing as Opay & PalmPay',
        severity: 'Critical',
        category: 'Android Banking Trojan',
        region: 'Telegram Channels',
        description: 'Malicious APKs requesting accessibility permissions to capture OTP codes and banking keystrokes.',
        time: '2h ago',
      ),
      const ThreatCampaign(
        title: 'Pig-Butchering Crypto Romance Ring',
        severity: 'High',
        category: 'Financial Fraud',
        region: 'Regional',
        description: 'Dating lures redirecting victims to fraudulent synthetic crypto exchanges with staged balances.',
        time: '4h ago',
      ),
      const ThreatCampaign(
        title: 'Microsoft 365 MFA Fatigue Attack',
        severity: 'Medium',
        category: 'Account Takeover',
        region: 'Corporate / Global',
        description: 'Spamming corporate staff with dozens of push notifications at night until approved.',
        time: '8h ago',
      ),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        children: [
          Text(
            'Threat Intel Desk',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          Text(
            'National active campaign monitor',
            style: TextStyle(color: Theme.of(context).hintColor, fontSize: 13),
          ),
          const SizedBox(height: 16),

          // 24H Monitor Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('NATIONAL 24H MONITOR', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatBox('17', 'Campaigns'),
                      _StatBox('4', 'Critical', color: SentinelTheme.danger),
                      _StatBox('98.4%', 'Intercept', color: SentinelTheme.green),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          const Text('ACTIVE CAMPAIGNS & IOCS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2, color: Colors.white70)),
          const SizedBox(height: 10),

          for (final c in campaigns)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: c.severity == 'Critical'
                                  ? SentinelTheme.danger.withValues(alpha: 0.15)
                                  : SentinelTheme.warn.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              c.severity,
                              style: TextStyle(
                                color: c.severity == 'Critical' ? SentinelTheme.danger : SentinelTheme.warn,
                                fontWeight: FontWeight.w800,
                                fontSize: 11,
                              ),
                            ),
                          ),
                          Text(c.time, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(c.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                      const SizedBox(height: 4),
                      Text(c.description, style: const TextStyle(fontSize: 12, height: 1.45, color: Colors.white70)),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 6,
                        children: [
                          _TagChip(c.category),
                          _TagChip('📍 ${c.region}'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _StatBox(String val, String label, {Color color = SentinelTheme.blue}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: SentinelTheme.surfaceDark2,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Text(val, style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 18)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(color: Colors.white60, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _TagChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: SentinelTheme.surfaceDark2,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.w600)),
    );
  }
}
