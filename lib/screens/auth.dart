import 'package:flutter/material.dart';
import '../theme.dart';

class Splash extends StatelessWidget {
  final VoidCallback onEnter;
  const Splash({super.key, required this.onEnter});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Spacer(),
              Container(
                width: 84,
                height: 84,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  gradient: const LinearGradient(colors: [SentinelTheme.green, SentinelTheme.blue]),
                ),
                child: const Icon(Icons.shield_moon, size: 42, color: Color(0xFF04110B)),
              ),
              const SizedBox(height: 18),
              Text('Sentinel AI', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              const Text('DETECT. PROTECT. PREVENT.', style: TextStyle(letterSpacing: 2, color: SentinelTheme.green, fontWeight: FontWeight.w700, fontSize: 12)),
              const SizedBox(height: 12),
              Text('Intelligent defence for Nigeria’s digital economy.', textAlign: TextAlign.center, style: TextStyle(color: Theme.of(context).hintColor)),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: onEnter,
                  style: FilledButton.styleFrom(
                    backgroundColor: SentinelTheme.green,
                    foregroundColor: const Color(0xFF04110B),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Enter the app', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
