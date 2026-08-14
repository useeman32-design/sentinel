import 'package:flutter/material.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});
  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final items = [
    _N('High Risk', 'Dangerous SMS lure blocked', false),
    _N('Suspicious', 'New sign-in from Abuja', false),
    _N('Password', 'Work mailbox below policy', false),
    _N('New Threat', 'Fake Opay APK circulating', false),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () => setState(() {
              for (final i in items) {
                i.seen = true;
              }
            }),
            child: const Text('Mark all'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          for (final n in items)
            Opacity(
              opacity: n.seen ? 0.5 : 1,
              child: Card(
                child: ListTile(
                  title: Text(n.title),
                  subtitle: Text(n.kind),
                  trailing: n.seen
                      ? const Text('Received')
                      : TextButton(
                          onPressed: () => setState(() => n.seen = true),
                          child: const Text('Mark received'),
                        ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _N {
  _N(this.kind, this.title, this.seen);
  final String kind, title;
  bool seen;
}
