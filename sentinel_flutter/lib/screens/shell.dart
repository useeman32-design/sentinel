import 'package:flutter/material.dart';
import '../theme.dart';
import 'home.dart';
import 'scan.dart';
import 'notifications.dart';
import 'academy.dart';

class AppShell extends StatefulWidget {
  final VoidCallback onToggleTheme;
  final VoidCallback onLogout;
  const AppShell({super.key, required this.onToggleTheme, required this.onLogout});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomeScreen(
        onNotify: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
        onAcademy: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademyScreen())),
        onOpenScan: (i) {
          setState(() => index = 1);
        },
        onViewAllScans: () => setState(() => index = 1),
      ),
      const ScanHub(),
      const _Assistant(),
      const _Intel(),
      _More(onToggleTheme: widget.onToggleTheme, onLogout: widget.onLogout),
    ];

    return Scaffold(
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.qr_code_scanner), label: 'Scan'),
          NavigationDestination(icon: Icon(Icons.auto_awesome), label: 'AI'),
          NavigationDestination(icon: Icon(Icons.shield_outlined), label: 'Intel'),
          NavigationDestination(icon: Icon(Icons.more_horiz), label: 'More'),
        ],
        indicatorColor: SentinelTheme.green.withValues(alpha: 0.2),
      ),
    );
  }
}

class _Assistant extends StatelessWidget {
  const _Assistant();
  @override
  Widget build(BuildContext context) {
    return const SafeArea(
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Text('AI Assistant — wire Gemini with your key. No fake answers.'),
      ),
    );
  }
}

class _Intel extends StatelessWidget {
  const _Intel();
  @override
  Widget build(BuildContext context) {
    final items = [
      ['Critical', 'Fake CBN BVN SMS'],
      ['High', 'WhatsApp family-emergency mule'],
      ['Critical', 'Fake Opay APK'],
    ];
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Threat Intel', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          ...items.map((e) => Card(
                child: ListTile(title: Text(e[1]), subtitle: Text(e[0])),
              )),
        ],
      ),
    );
  }
}

class _More extends StatelessWidget {
  final VoidCallback onToggleTheme;
  final VoidCallback onLogout;
  const _More({required this.onToggleTheme, required this.onLogout});
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('More', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          SwitchListTile(title: const Text('Dark / light'), value: Theme.of(context).brightness == Brightness.dark, onChanged: (_) => onToggleTheme()),
          ListTile(
            title: const Text('Cyber Academy'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AcademyScreen())),
          ),
          ListTile(
            title: const Text('Notifications'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
          ),
          TextButton(onPressed: onLogout, child: const Text('Sign out')),
        ],
      ),
    );
  }
}
