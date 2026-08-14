import 'dart:async';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../theme.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onNotify;
  final VoidCallback onAcademy;
  final VoidCallback onViewAllScans;
  final void Function(int) onOpenScan;

  const HomeScreen({
    super.key,
    required this.onNotify,
    required this.onAcademy,
    required this.onViewAllScans,
    required this.onOpenScan,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final page = PageController();
  int idx = 0;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    timer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (mounted && page.hasClients) {
        idx = (idx + 1) % 3;
        page.animateToPage(
          idx,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeOutCubic,
        );
      }
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    page.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scans = [
      (Icons.link, 'Link', const Color(0xFF00C8FF), 0),
      (Icons.sms_outlined, 'SMS', const Color(0xFF00FF88), 1),
      (Icons.mail_outline, 'Email', const Color(0xFFA78BFA), 2),
      (Icons.qr_code_2, 'QR', const Color(0xFFFFB020), 3),
    ];

    final news = [
      ('NG', 'Fake CBN BVN recertification texts spike in Lagos', '32m ago'),
      ('WA', 'WhatsApp “family emergency” mule network active', '2h ago'),
      ('APK', 'Counterfeit Opay update circulating on Telegram', '5h ago'),
    ];

    final activity = [
      ('SMS lottery lure blocked', '2m ago', SentinelTheme.danger),
      ('Link scan · paystack.co', '18m ago', SentinelTheme.green),
      ('Password check · weak', '1h ago', SentinelTheme.warn),
      ('QR destination verified', '3h ago', SentinelTheme.blue),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        children: [
          // Top Bar
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hi, Amina',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    Text(
                      'Nigeria Threat Desk · Live Monitor',
                      style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: widget.onNotify,
                icon: const Badge(
                  backgroundColor: SentinelTheme.danger,
                  smallSize: 8,
                  child: Icon(Icons.notifications_outlined),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Swiping Metric Cards Carousel
          SizedBox(
            height: 168,
            child: PageView(
              controller: page,
              onPageChanged: (i) => setState(() => idx = i),
              children: [
                _ScoreCard(),
                _ThreatsCard(),
                _BlockedCard(),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Carousel Dot Indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              3,
              (i) => GestureDetector(
                onTap: () {
                  page.animateToPage(i, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: i == idx ? 22 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: i == idx ? SentinelTheme.green : Colors.white24,
                    borderRadius: BorderRadius.circular(9),
                    boxShadow: i == idx
                        ? [BoxShadow(color: SentinelTheme.green.withOpacity(0.4), blurRadius: 6)]
                        : null,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Quick Scan Header
          Row(
            children: [
              const Text(
                'QUICK SCAN',
                style: TextStyle(letterSpacing: 1.2, fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white70),
              ),
              const Spacer(),
              TextButton(
                onPressed: widget.onViewAllScans,
                child: const Text('View all (7)', style: TextStyle(fontSize: 12, color: SentinelTheme.blue)),
              ),
            ],
          ),

          // 4-Column Quick Scan Row
          Row(
            children: [
              for (final s in scans)
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    child: Card(
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () => widget.onOpenScan(s.$4),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          child: Column(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: s.$3.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(s.$1, color: s.$3, size: 22),
                              ),
                              const SizedBox(height: 8),
                              Text(s.$2, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),

          // Cyber Academy Callout
          InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: widget.onAcademy,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: const LinearGradient(
                  colors: [Color(0xFF07291C), Color(0xFF0B1B2B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border.all(color: SentinelTheme.green.withOpacity(0.25)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: SentinelTheme.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(Icons.school, color: SentinelTheme.green, size: 26),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Cyber Academy', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
                        SizedBox(height: 2),
                        Text(
                          'Learn how to stop phishing, SIM-swap, and WhatsApp fraud.',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.white70),
                ],
              ),
            ),
          ),
          const SizedBox(height: 22),

          // Intercepted Chart Section
          const Text(
            'THREATS INTERCEPTED / DAY',
            style: TextStyle(letterSpacing: 1.2, fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white70),
          ),
          const SizedBox(height: 10),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  SizedBox(
                    height: 140,
                    child: LineChart(
                      LineChartData(
                        gridData: const FlGridData(show: false),
                        titlesData: const FlTitlesData(show: false),
                        borderData: FlBorderData(show: false),
                        lineBarsData: [
                          _line([6, 9, 7, 14, 11, 8, 12], SentinelTheme.blue),
                          _line([4, 5, 8, 10, 7, 6, 9], SentinelTheme.green),
                          _line([2, 1, 3, 4, 2, 3, 2], SentinelTheme.warn),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _LegendItem(color: SentinelTheme.blue, label: 'Phishing'),
                      _LegendItem(color: SentinelTheme.green, label: 'SMS Smishing'),
                      _LegendItem(color: SentinelTheme.warn, label: 'Malware APK'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 22),

          // Latest Threat News
          const Text(
            'LATEST THREAT NEWS',
            style: TextStyle(letterSpacing: 1.2, fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white70),
          ),
          const SizedBox(height: 10),
          Card(
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: news.length,
              separatorBuilder: (_, __) => const Divider(height: 1, color: Colors.white10),
              itemBuilder: (ctx, i) {
                final n = news[i];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  child: Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: SentinelTheme.surfaceDark2,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          n.$1,
                          style: const TextStyle(color: SentinelTheme.blue, fontWeight: FontWeight.w800, fontSize: 12),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(n.$2, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                            Text(n.$3, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 22),

          // Recent Activity
          const Text(
            'RECENT ACTIVITY',
            style: TextStyle(letterSpacing: 1.2, fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white70),
          ),
          const SizedBox(height: 10),
          Card(
            child: ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: activity.length,
              separatorBuilder: (_, __) => const Divider(height: 1, color: Colors.white10),
              itemBuilder: (ctx, i) {
                final a = activity[i];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(color: a.$3, shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(a.$1, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                            Text(a.$2, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  LineChartBarData _line(List<double> ys, Color c) => LineChartBarData(
        isCurved: true,
        color: c,
        barWidth: 2.5,
        dotData: const FlDotData(show: false),
        spots: [for (var i = 0; i < ys.length; i++) FlSpot(i.toDouble(), ys[i])],
      );
}

class _ScoreCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xFF064E3B), Color(0xFF0B1220), Color(0xFF022C22)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: Colors.white12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('SECURITY SCORE', style: TextStyle(color: Colors.white70, letterSpacing: 1.2, fontSize: 11, fontWeight: FontWeight.w800)),
              SizedBox(height: 4),
              Text('86', style: TextStyle(color: Colors.white, fontSize: 44, fontWeight: FontWeight.w800)),
              Text('Low residual risk · +4 pts', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
          SizedBox(
            width: 76,
            height: 76,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: 0.86,
                  strokeWidth: 8,
                  backgroundColor: Colors.white12,
                  valueColor: const AlwaysStoppedAnimation(SentinelTheme.green),
                ),
                const Text('86%', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ThreatsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xFF0C4A6E), Color(0xFF0B1220), Color(0xFF082F49)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: Colors.white12),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('THREATS DETECTED', style: TextStyle(color: Colors.white70, letterSpacing: 1.2, fontSize: 11, fontWeight: FontWeight.w800)),
              SizedBox(height: 4),
              Text('128', style: TextStyle(color: Colors.white, fontSize: 44, fontWeight: FontWeight.w800)),
              Text('Phish & SMS leading', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
          Icon(Icons.query_stats, color: SentinelTheme.blue, size: 54),
        ],
      ),
    );
  }
}

class _BlockedCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xFF7C2D12), Color(0xFF1C1917), Color(0xFF431407)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: Colors.white12),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('SCAMS BLOCKED', style: TextStyle(color: Colors.white70, letterSpacing: 1.2, fontSize: 11, fontWeight: FontWeight.w800)),
              SizedBox(height: 4),
              Text('91', style: TextStyle(color: Colors.white, fontSize: 44, fontWeight: FontWeight.w800)),
              Text('71% intercept rate', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
          Icon(Icons.shield, color: SentinelTheme.warn, size: 54),
        ],
      ),
    );
  }
}

class _LegendItem extends StatelessWidget {
  final Color color;
  final String label;
  const _LegendItem({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white70)),
      ],
    );
  }
}
