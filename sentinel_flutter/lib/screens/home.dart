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
      idx = (idx + 1) % 3;
      if (page.hasClients) {
        page.animateToPage(idx, duration: const Duration(milliseconds: 420), curve: Curves.easeOut);
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
      (Icons.link, 'Link', const Color(0xFF00C8FF)),
      (Icons.sms_outlined, 'SMS', const Color(0xFF00FF88)),
      (Icons.mail_outline, 'Email', const Color(0xFFA78BFA)),
      (Icons.qr_code_2, 'QR', const Color(0xFFFFB020)),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        children: [
          Row(
            children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Hi, Amina', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                  Text('Nigeria threat desk · live', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12)),
                ]),
              ),
              IconButton(onPressed: widget.onNotify, icon: const Icon(Icons.notifications_none)),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 188,
            child: PageView(
              controller: page,
              onPageChanged: (i) => setState(() => idx = i),
              children: const [
                _StatCard(title: 'SECURITY SCORE', value: '86', sub: 'Low residual risk', color: Color(0xFF064E3B)),
                _StatCard(title: 'THREATS DETECTED', value: '128', sub: 'Phish + SMS leading', color: Color(0xFF0C4A6E)),
                _StatCard(title: 'SCAMS BLOCKED', value: '91', sub: '71% intercept rate', color: Color(0xFF7C2D12)),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(3, (i) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: i == idx ? 16 : 6,
              height: 6,
              decoration: BoxDecoration(color: i == idx ? SentinelTheme.green : Colors.white24, borderRadius: BorderRadius.circular(9)),
            )),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              const Text('QUICK SCAN', style: TextStyle(letterSpacing: 1, fontSize: 12, fontWeight: FontWeight.w700)),
              const Spacer(),
              TextButton(onPressed: widget.onViewAllScans, child: const Text('View all')),
            ],
          ),
          Row(
            children: [
              for (final s in scans)
                Expanded(
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Card(
                      child: InkWell(
                        onTap: () => widget.onOpenScan(1),
                        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                          Icon(s.$1, color: s.$3),
                          const SizedBox(height: 6),
                          Text(s.$2, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                        ]),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          InkWell(
            onTap: widget.onAcademy,
            child: Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: const LinearGradient(colors: [Color(0xFF07291C), Color(0xFF06263A)]),
                border: Border.all(color: SentinelTheme.green.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.school, color: SentinelTheme.green, size: 32),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('Cyber Academy', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
                      Text('Learn how to stop phishing and WhatsApp fraud.', style: TextStyle(color: Colors.white70)),
                    ]),
                  ),
                  Icon(Icons.chevron_right, color: Colors.white70),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),
          const Text('THREATS INTERCEPTED / DAY', style: TextStyle(letterSpacing: 1, fontSize: 12, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          SizedBox(
            height: 180,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  _line([6, 9, 7, 14, 11, 8, 12], const Color(0xFF00C8FF)),
                  _line([4, 5, 8, 10, 7, 6, 9], const Color(0xFF00FF88)),
                  _line([2, 1, 3, 4, 2, 3, 2], const Color(0xFFFFB020)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  LineChartBarData _line(List<double> ys, Color c) => LineChartBarData(
        isCurved: true,
        color: c,
        barWidth: 3,
        dotData: const FlDotData(show: false),
        spots: [for (var i = 0; i < ys.length; i++) FlSpot(i.toDouble(), ys[i])],
      );
}

class _StatCard extends StatelessWidget {
  final String title, value, sub;
  final Color color;
  const _StatCard({required this.title, required this.value, required this.sub, required this.color});
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(22)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(color: Colors.white70, letterSpacing: 1.2, fontSize: 12, fontWeight: FontWeight.w700)),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.w700)),
        Text(sub, style: const TextStyle(color: Colors.white70)),
      ]),
    );
  }
}
