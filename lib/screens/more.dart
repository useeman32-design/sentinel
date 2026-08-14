import 'package:flutter/material.dart';
import '../theme.dart';
import 'notifications.dart';
import 'training.dart';
import 'reports.dart';

class MoreScreen extends StatelessWidget {
  final VoidCallback onToggleTheme;
  final VoidCallback onLogout;

  const MoreScreen({
    super.key,
    required this.onToggleTheme,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        children: [
          Text(
            'More',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          Text('Account & Security Operations', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 13)),
          const SizedBox(height: 16),

          // User Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: SentinelTheme.green.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.person, color: SentinelTheme.green, size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Amina Bello', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                        const Text('amina@sentinel.ng', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: SentinelTheme.green.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text('Pro Enterprise', style: TextStyle(color: SentinelTheme.green, fontSize: 10, fontWeight: FontWeight.w800)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          Card(
            child: Column(
              children: [
                _NavRow(
                  icon: Icons.person_outline,
                  title: 'User Profile',
                  subtitle: 'Identity, role & credentials',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())),
                ),
                const Divider(height: 1, color: Colors.white10),
                _NavRow(
                  icon: Icons.notifications_none,
                  title: 'Threat Alerts',
                  subtitle: 'Real-time campaign warnings',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
                ),
                const Divider(height: 1, color: Colors.white10),
                _NavRow(
                  icon: Icons.description_outlined,
                  title: 'Executive Reports',
                  subtitle: 'Exportable threat briefings',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ReportsScreen())),
                ),
                const Divider(height: 1, color: Colors.white10),
                _NavRow(
                  icon: Icons.school_outlined,
                  title: 'Cyber Academy',
                  subtitle: 'Interactive learning tracks',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TrainingScreen())),
                ),
                const Divider(height: 1, color: Colors.white10),
                _NavRow(
                  icon: Icons.settings_outlined,
                  title: 'Settings',
                  subtitle: 'Theme, language & privacy',
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => SettingsScreen(onToggleTheme: onToggleTheme),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          OutlinedButton.icon(
            onPressed: onLogout,
            icon: const Icon(Icons.logout, color: SentinelTheme.danger, size: 18),
            label: const Text('Sign Out of Workspace', style: TextStyle(color: SentinelTheme.danger)),
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: SentinelTheme.danger.withValues(alpha: 0.4)),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
          ),
        ],
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: SentinelTheme.green.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Icon(Icons.person, color: SentinelTheme.green, size: 40),
                  ),
                  const SizedBox(height: 14),
                  const Text('Amina Bello', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                  const Text('Security Analyst', style: TextStyle(color: Colors.white60, fontSize: 13)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: SentinelTheme.blue.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(20)),
                    child: const Text('Pro Enterprise Tier', style: TextStyle(color: SentinelTheme.blue, fontSize: 11, fontWeight: FontWeight.w800)),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Column(
              children: [
                _InfoRow('Email', 'amina@sentinel.ng'),
                const Divider(height: 1, color: Colors.white10),
                _InfoRow('Company', 'Lagos Fintech Hub'),
                const Divider(height: 1, color: Colors.white10),
                _InfoRow('Role', 'Security Analyst'),
                const Divider(height: 1, color: Colors.white10),
                _InfoRow('Status', 'Verified Active'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _InfoRow(String k, String v) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(k, style: const TextStyle(color: Colors.white60, fontSize: 13)),
          Text(v, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
        ],
      ),
    );
  }
}

class SettingsScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const SettingsScreen({super.key, required this.onToggleTheme});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool notifOn = true;
  String language = 'English';

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Dark Mode', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: const Text('Neon command aesthetic', style: TextStyle(fontSize: 11)),
                  value: isDark,
                  onChanged: (_) => widget.onToggleTheme(),
                ),
                const Divider(height: 1, color: Colors.white10),
                SwitchListTile(
                  title: const Text('Push Notifications', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: const Text('Real-time high severity alerts', style: TextStyle(fontSize: 11)),
                  value: notifOn,
                  onChanged: (v) => setState(() => notifOn = v),
                ),
                const Divider(height: 1, color: Colors.white10),
                ListTile(
                  title: const Text('Language', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  subtitle: Text('Current: $language', style: const TextStyle(fontSize: 11)),
                  trailing: DropdownButton<String>(
                    value: language,
                    underline: const SizedBox(),
                    dropdownColor: SentinelTheme.surfaceDark,
                    items: const [
                      DropdownMenuItem(value: 'English', child: Text('English')),
                      DropdownMenuItem(value: 'Hausa', child: Text('Hausa')),
                      DropdownMenuItem(value: 'Yoruba', child: Text('Yoruba')),
                      DropdownMenuItem(value: 'Igbo', child: Text('Igbo')),
                    ],
                    onChanged: (val) => setState(() => language = val ?? 'English'),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Column(
              children: const [
                ListTile(title: Text('API Keys & Telemetry'), trailing: Icon(Icons.chevron_right)),
                Divider(height: 1, color: Colors.white10),
                ListTile(title: Text('Data Privacy & Retention'), trailing: Icon(Icons.chevron_right)),
                Divider(height: 1, color: Colors.white10),
                ListTile(title: Text('Device Encryption Status'), trailing: Icon(Icons.chevron_right)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NavRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _NavRow({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: SentinelTheme.blue, size: 22),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
      subtitle: Text(subtitle, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}
