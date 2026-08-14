import 'package:flutter/material.dart';
import '../theme.dart';
import 'home.dart';
import 'scan.dart';
import 'assistant.dart';
import 'intel.dart';
import 'more.dart';
import 'notifications.dart';
import 'training.dart';

class AppShell extends StatefulWidget {
  final VoidCallback onToggleTheme;
  final VoidCallback onLogout;

  const AppShell({
    super.key,
    required this.onToggleTheme,
    required this.onLogout,
  });

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int index = 0;

  void openSpecificScan(int scanIndex) {
    setState(() => index = 1);
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomeScreen(
        onNotify: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
        onAcademy: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TrainingScreen())),
        onOpenScan: openSpecificScan,
        onViewAllScans: () => setState(() => index = 1),
      ),
      const ScanHub(),
      const AssistantScreen(),
      const IntelScreen(),
      MoreScreen(
        onToggleTheme: widget.onToggleTheme,
        onLogout: widget.onLogout,
      ),
    ];

    return Scaffold(
      body: IndexedStack(
        index: index,
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        backgroundColor: Theme.of(context).brightness == Brightness.dark
            ? SentinelTheme.surfaceDark
            : SentinelTheme.surfaceLight,
        elevation: 10,
        indicatorColor: SentinelTheme.green.withValues(alpha: 0.2),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: SentinelTheme.green),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.qr_code_scanner),
            selectedIcon: Icon(Icons.qr_code_scanner, color: SentinelTheme.green),
            label: 'Scan',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome),
            selectedIcon: Icon(Icons.auto_awesome, color: SentinelTheme.green),
            label: 'AI Advisor',
          ),
          NavigationDestination(
            icon: Icon(Icons.shield_outlined),
            selectedIcon: Icon(Icons.shield, color: SentinelTheme.green),
            label: 'Intel',
          ),
          NavigationDestination(
            icon: Icon(Icons.more_horiz),
            selectedIcon: Icon(Icons.more_horiz, color: SentinelTheme.green),
            label: 'More',
          ),
        ],
      ),
    );
  }
}
