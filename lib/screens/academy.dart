import 'package:flutter/material.dart';

class AcademyScreen extends StatelessWidget {
  const AcademyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final courses = [
      ('Everyday self-defence', 'OTP, BVN, WhatsApp and ATM basics.'),
      ('Account takeover lab', 'SIM-swap, BEC and QR fraud.'),
      ('Team response', 'For analysts and founders.'),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('Cyber Academy')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Protect yourself in today’s Nigeria', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          for (final c in courses)
            Card(
              child: ListTile(
                title: Text(c.$1, style: const TextStyle(fontWeight: FontWeight.w800)),
                subtitle: Text(c.$2),
                trailing: const Icon(Icons.chevron_right),
              ),
            ),
        ],
      ),
    );
  }
}
