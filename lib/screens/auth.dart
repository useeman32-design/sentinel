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
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              const Spacer(),
              Container(
                width: 88,
                height: 88,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  gradient: const LinearGradient(
                    colors: [SentinelTheme.green, SentinelTheme.blue],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: SentinelTheme.green.withValues(alpha: 0.3),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(Icons.shield_outlined, size: 48, color: Color(0xFF04110B)),
              ),
              const SizedBox(height: 24),
              Text(
                'Sentinel AI',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: SentinelTheme.green.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'DETECT. PROTECT. PREVENT.',
                  style: TextStyle(
                    letterSpacing: 1.5,
                    color: SentinelTheme.green,
                    fontWeight: FontWeight.w800,
                    fontSize: 11,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Autonomous defense platform for Nigeria’s digital economy — combating smishing, fraud, and account takeovers.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Theme.of(context).hintColor,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: onEnter,
                  child: const Text('Enter Workspace'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => RegisterScreen(onRegistered: onEnter),
                      ),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Create an Account'),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  final VoidCallback onLogin;
  const LoginScreen({super.key, required this.onLogin});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailCtrl = TextEditingController(text: 'amina@sentinel.ng');
  final passCtrl = TextEditingController(text: '••••••••');
  bool rememberMe = true;
  bool obscure = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          children: [
            const Icon(Icons.lock_person_outlined, size: 54, color: SentinelTheme.blue),
            const SizedBox(height: 16),
            Text(
              'Welcome Back',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            Text(
              'Sign in to your Sentinel security dashboard',
              style: TextStyle(color: Theme.of(context).hintColor, fontSize: 13),
            ),
            const SizedBox(height: 28),
            TextField(
              controller: emailCtrl,
              decoration: const InputDecoration(labelText: 'Work Email', prefixIcon: Icon(Icons.mail_outline)),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: passCtrl,
              obscureText: obscure,
              decoration: InputDecoration(
                labelText: 'Password',
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => obscure = !obscure),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Checkbox(value: rememberMe, onChanged: (v) => setState(() => rememberMe = v ?? true)),
                const Text('Remember me', style: TextStyle(fontSize: 13)),
                const Spacer(),
                TextButton(
                  onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ForgotPasswordScreen())),
                  child: const Text('Forgot Password?', style: TextStyle(fontSize: 12, color: SentinelTheme.blue)),
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: widget.onLogin,
                child: const Text('Sign In'),
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: widget.onLogin,
              icon: const Icon(Icons.security, size: 18),
              label: const Text('Continue with Single Sign-On (SSO)'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class RegisterScreen extends StatefulWidget {
  final VoidCallback onRegistered;
  const RegisterScreen({super.key, required this.onRegistered});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final companyCtrl = TextEditingController();
  final passCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const Text(
              'Join Sentinel Network',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            Text('Deploy autonomous threat monitors for your identity', style: TextStyle(color: Theme.of(context).hintColor)),
            const SizedBox(height: 24),
            TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: 'Full Name')),
            const SizedBox(height: 12),
            TextField(controller: emailCtrl, decoration: const InputDecoration(labelText: 'Work Email Address')),
            const SizedBox(height: 12),
            TextField(controller: companyCtrl, decoration: const InputDecoration(labelText: 'Company / Organization')),
            const SizedBox(height: 12),
            TextField(controller: passCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Secure Password')),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => VerifyEmailScreen(onVerified: widget.onRegistered),
                  ),
                );
              },
              child: const Text('Create Account'),
            ),
          ],
        ),
      ),
    );
  }
}

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final ctrl = TextEditingController();
    return Scaffold(
      appBar: AppBar(title: const Text('Reset Access')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Recover Password', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text('We will send a 6-digit recovery code to your registered email.', style: TextStyle(color: Theme.of(context).hintColor)),
            const SizedBox(height: 24),
            TextField(controller: ctrl, decoration: const InputDecoration(labelText: 'Work Email')),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => VerifyEmailScreen(onVerified: () => Navigator.pop(context))));
                },
                child: const Text('Send Recovery Code'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class VerifyEmailScreen extends StatelessWidget {
  final VoidCallback onVerified;
  const VerifyEmailScreen({super.key, required this.onVerified});

  @override
  Widget build(BuildContext context) {
    final ctrl = TextEditingController();
    return Scaffold(
      appBar: AppBar(title: const Text('Verify Code')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Enter 6-Digit Code', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text('Check your inbox for the one-time verification token.', style: TextStyle(color: Theme.of(context).hintColor)),
            const SizedBox(height: 24),
            TextField(
              controller: ctrl,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, letterSpacing: 8, fontWeight: FontWeight.w800),
              decoration: const InputDecoration(hintText: '000000'),
              maxLength: 6,
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: onVerified,
                child: const Text('Verify & Proceed'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
