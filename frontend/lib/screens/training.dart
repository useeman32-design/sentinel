import 'package:flutter/material.dart';
import '../models/threat.dart';
import '../theme.dart';

class TrainingScreen extends StatelessWidget {
  const TrainingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final courses = [
      const AcademyCourse(
        id: 'c1',
        title: 'Everyday Self-Defence',
        blurb: 'Master OTP protection, BVN security, WhatsApp locks and ATM safety.',
        lessonsCount: 6,
        progress: 45,
        items: [
          LessonItem(title: 'How Phishing Really Works', body: 'Attackers create urgent lookalike sites. Always pause and verify the domain spelling.'),
          LessonItem(title: 'OTP and PIN Hygiene', body: 'No bank or CBN agent will ever request your OTP. Hang up immediately.'),
          LessonItem(title: 'Hardening WhatsApp & Socials', body: 'Enable Two-Step Verification with a PIN and audit linked web sessions.'),
          LessonItem(title: 'Airtime & Emergency Scams', body: 'Always voice-call the family member on a known line before transferring funds.'),
        ],
      ),
      const AcademyCourse(
        id: 'c2',
        title: 'Account Takeover Lab',
        blurb: 'SIM-swap prevention, BEC, spoofed invoices and QR tampering.',
        lessonsCount: 5,
        progress: 20,
        items: [
          LessonItem(title: 'SIM-Swap Playbook & Indicators', body: 'Set a custom SIM PIN. If cellular bars drop in good signal areas, alert your bank.'),
          LessonItem(title: 'Business Email Compromise (BEC)', body: 'Attackers silently compromise vendor mailboxes to alter bank details. Always verify account updates.'),
          LessonItem(title: 'Malicious QR Codes & POS Tampering', body: 'Examine QR stickers on physical counters before paying.'),
        ],
      ),
      const AcademyCourse(
        id: 'c3',
        title: 'Team & Enterprise Response',
        blurb: 'Triage playbooks, malware signature analysis, and board-ready reporting.',
        lessonsCount: 4,
        progress: 10,
        items: [
          LessonItem(title: 'Incident Triage in 15 Minutes', body: 'Contain, preserve evidence, notify, and recover.'),
          LessonItem(title: 'Malware First Look & Header Analysis', body: 'Inspecting PE headers, magic bytes, and SHA-256 hashes safely.'),
        ],
      ),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Cyber Academy')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: const LinearGradient(
                colors: [Color(0xFF07291C), Color(0xFF0B1B2B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              border: Border.all(color: SentinelTheme.green.withOpacity(0.3)),
            ),
            child: const Row(
              children: [
                Icon(Icons.school, color: SentinelTheme.green, size: 36),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Learn. Then scan.', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Colors.white)),
                      SizedBox(height: 2),
                      Text('Practical lessons built around real Nigerian scams.', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text('AVAILABLE TRACKS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2, color: Colors.white70)),
          const SizedBox(height: 10),
          for (final c in courses)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              child: Card(
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => CourseDetailScreen(course: c))),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(c.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                            Text('${c.lessonsCount} lessons', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(c.blurb, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12)),
                        const SizedBox(height: 12),
                        LinearProgressIndicator(
                          value: c.progress / 100.0,
                          backgroundColor: Colors.white10,
                          valueColor: const AlwaysStoppedAnimation(SentinelTheme.green),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('${c.progress}% completed', style: const TextStyle(fontSize: 11, color: Colors.white60)),
                            const Text('Start lesson →', style: TextStyle(fontSize: 11, color: SentinelTheme.blue, fontWeight: FontWeight.w700)),
                          ],
                        ),
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

class CourseDetailScreen extends StatelessWidget {
  final AcademyCourse course;
  const CourseDetailScreen({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(course.title)),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          for (var i = 0; i < course.items.length; i++)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'MODULE 0${i + 1}',
                        style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 10, color: SentinelTheme.green, letterSpacing: 1.2),
                      ),
                      const SizedBox(height: 4),
                      Text(course.items[i].title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                      const SizedBox(height: 6),
                      Text(course.items[i].body, style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.white70)),
                    ],
                  ),
                ),
              ),
            ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Module marked complete! Progress saved.')),
              );
            },
            child: const Text('Mark Track Complete'),
          ),
        ],
      ),
    );
  }
}
