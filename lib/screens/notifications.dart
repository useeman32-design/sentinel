import 'package:flutter/material.dart';
import '../models/threat.dart';
import '../theme.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<NotificationItem> items = [
    NotificationItem(
      id: 'n1',
      kind: 'High Risk',
      title: 'Dangerous SMS Lure Blocked',
      body: 'Lottery claim asking for ₦2,000 “processing fee” via shortened link.',
      time: '2m',
      tone: 'chip-bad',
    ),
    NotificationItem(
      id: 'n2',
      kind: 'Suspicious Sign-in',
      title: 'New Session from Abuja',
      body: 'Chrome on Windows · IP 102.89.x.x · MFA Verified.',
      time: '18m',
      tone: 'chip-warn',
    ),
    NotificationItem(
      id: 'n3',
      kind: 'Password Weak',
      title: 'Work Mailbox Below Policy',
      body: 'Entropy under the 70-point minimum threshold.',
      time: '1h',
      tone: 'chip-warn',
    ),
    NotificationItem(
      id: 'n4',
      kind: 'Critical Threat',
      title: 'Fake Opay APK Circulating',
      body: 'Sideloaded update impersonating Opay 4.12 detected in local network.',
      time: '3h',
      tone: 'chip-bad',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final unread = items.where((i) => !i.seen).length;

    return Scaffold(
      appBar: AppBar(
        title: Text('Threat Alerts ${unread > 0 ? '($unread)' : ''}'),
        actions: [
          if (unread > 0)
            TextButton(
              onPressed: () {
                setState(() {
                  for (final i in items) {
                    i.seen = true;
                  }
                });
              },
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        itemBuilder: (ctx, i) {
          final n = items[i];
          final color = n.tone == 'chip-bad'
              ? SentinelTheme.danger
              : n.tone == 'chip-warn'
                  ? SentinelTheme.warn
                  : SentinelTheme.blue;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: Opacity(
              opacity: n.seen ? 0.6 : 1.0,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 10,
                        height: 10,
                        margin: const EdgeInsets.only(top: 4, right: 12),
                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: color.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(n.kind, style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 10)),
                                ),
                                Text('${n.time} ago', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(n.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                            const SizedBox(height: 4),
                            Text(n.body, style: const TextStyle(fontSize: 12, height: 1.45, color: Colors.white70)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (!n.seen)
                        IconButton(
                          icon: const Icon(Icons.check_circle_outline, size: 20, color: SentinelTheme.green),
                          onPressed: () => setState(() => n.seen = true),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
