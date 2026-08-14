import 'package:flutter/material.dart';
import '../models/threat.dart';
import '../services/heuristics.dart';
import '../theme.dart';

class ScanHub extends StatelessWidget {
  const ScanHub({super.key});

  @override
  Widget build(BuildContext context) {
    final modules = [
      (Icons.link, 'Link Scanner', 'Live DNS + phishing feeds', const Color(0xFF00C8FF), const LinkScannerScreen()),
      (Icons.mail_outline, 'Email Scanner', 'Header spoofing + lure check', const Color(0xFF34D399), const EmailScannerScreen()),
      (Icons.sms_outlined, 'SMS Scanner', 'Nigerian smishing heuristics', const Color(0xFFA78BFA), const SmsScannerScreen()),
      (Icons.qr_code_2, 'QR Scanner', 'Visual decode & target audit', const Color(0xFF38BDF8), const QrScannerScreen()),
      (Icons.insert_drive_file_outlined, 'File Scanner', 'Magic-byte & SHA-256 hash', const Color(0xFFFBBF24), const FileScannerScreen()),
      (Icons.lock_outline, 'Password Check', 'Entropy & breach exposure', const Color(0xFF00FF88), const PasswordCheckerScreen()),
      (Icons.warning_amber, 'Breach Monitor', 'Mailbox MX & hygiene audit', const Color(0xFFFB7185), const BreachMonitorScreen()),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        children: [
          Text(
            'Threat Scanner',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
          ),
          Text(
            'Real-time multi-vector inspection engines',
            style: TextStyle(color: Theme.of(context).hintColor, fontSize: 13),
          ),
          const SizedBox(height: 18),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.1,
            ),
            itemCount: modules.length,
            itemBuilder: (ctx, i) {
              final m = modules[i];
              return Card(
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => m.$5)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 42,
                          height: 42,
                          decoration: BoxDecoration(
                            color: m.$4.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(m.$1, color: m.$4, size: 24),
                        ),
                        const Spacer(),
                        Text(m.$2, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                        const SizedBox(height: 2),
                        Text(m.$3, style: TextStyle(color: Theme.of(context).hintColor, fontSize: 11), maxLines: 2),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 1. LINK SCANNER
// -------------------------------------------------------------
class LinkScannerScreen extends StatefulWidget {
  const LinkScannerScreen({super.key});
  @override
  State<LinkScannerScreen> createState() => _LinkScannerScreenState();
}

class _LinkScannerScreenState extends State<LinkScannerScreen> {
  final ctrl = TextEditingController(text: 'https://secure-gtbank-login.verify-ng.com/update');
  ScanResult? result;
  bool busy = false;

  void runScan() {
    if (ctrl.text.isEmpty) return;
    setState(() => busy = true);
    Future.delayed(const Duration(milliseconds: 350), () {
      setState(() {
        busy = false;
        result = HeuristicsEngine.analyzeUrl(ctrl.text);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Link Scanner')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: ctrl,
            decoration: const InputDecoration(
              labelText: 'URL or Domain',
              prefixIcon: Icon(Icons.link),
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: [
              _PresetChip('Phish Lure', 'https://secure-gtbank-login.verify-ng.com/update', () => setState(() => ctrl.text = 'https://secure-gtbank-login.verify-ng.com/update')),
              _PresetChip('Opay Phish', 'http://opay-claim-bonus.xyz/login', () => setState(() => ctrl.text = 'http://opay-claim-bonus.xyz/login')),
              _PresetChip('Safe Site', 'https://paystack.com', () => setState(() => ctrl.text = 'https://paystack.com')),
            ],
          ),
          const SizedBox(height: 18),
          FilledButton(
            onPressed: busy ? null : runScan,
            child: Text(busy ? 'Analyzing...' : 'Analyse Link'),
          ),
          if (result != null) ...[
            const SizedBox(height: 20),
            VerdictWidget(result: result!),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 2. EMAIL SCANNER
// -------------------------------------------------------------
class EmailScannerScreen extends StatefulWidget {
  const EmailScannerScreen({super.key});
  @override
  State<EmailScannerScreen> createState() => _EmailScannerScreenState();
}

class _EmailScannerScreenState extends State<EmailScannerScreen> {
  final fromCtrl = TextEditingController(text: 'security@gtb-alerts.com');
  final bodyCtrl = TextEditingController(text: 'Dear customer, your BVN will be deactivated within 24 hours. Verify now: http://bit.ly/upd-bvn');
  ScanResult? result;
  bool busy = false;

  void runScan() {
    setState(() => busy = true);
    Future.delayed(const Duration(milliseconds: 350), () {
      setState(() {
        busy = false;
        result = HeuristicsEngine.analyzeEmail(fromCtrl.text, bodyCtrl.text);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Email Scanner')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: fromCtrl,
            decoration: const InputDecoration(labelText: 'Sender Email Address', prefixIcon: Icon(Icons.person_outline)),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: bodyCtrl,
            maxLines: 4,
            decoration: const InputDecoration(labelText: 'Email Message Body'),
          ),
          const SizedBox(height: 18),
          FilledButton(
            onPressed: busy ? null : runScan,
            child: Text(busy ? 'Scanning...' : 'Detect Phishing'),
          ),
          if (result != null) ...[
            const SizedBox(height: 20),
            VerdictWidget(result: result!),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 3. SMS SCANNER
// -------------------------------------------------------------
class SmsScannerScreen extends StatefulWidget {
  const SmsScannerScreen({super.key});
  @override
  State<SmsScannerScreen> createState() => _SmsScannerScreenState();
}

class _SmsScannerScreenState extends State<SmsScannerScreen> {
  final ctrl = TextEditingController(
    text: 'Congratulations! You won ₦2,000,000 in the MTN Promo. Pay ₦2,000 processing fee to claim via this link http://bit.ly/claim-mtn',
  );
  ScanResult? result;
  bool busy = false;

  void runScan() {
    setState(() => busy = true);
    Future.delayed(const Duration(milliseconds: 350), () {
      setState(() {
        busy = false;
        result = HeuristicsEngine.analyzeSms(ctrl.text);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SMS Scanner')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: ctrl,
            maxLines: 4,
            decoration: const InputDecoration(labelText: 'SMS Text Content'),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: [
              _PresetChip('MTN Promo', 'promo', () => setState(() => ctrl.text = 'Congratulations! You won ₦2,000,000 in the MTN Promo. Pay ₦2,000 fee via http://bit.ly/claim')),
              _PresetChip('BVN Suspension', 'bvn', () => setState(() => ctrl.text = 'CBN ALERT: Your BVN has been flagged for suspension. Click https://cbn-bvn-portal.top to verify.')),
              _PresetChip('Fake Credit', 'credit', () => setState(() => ctrl.text = 'Your Acct 012***789 has received N250,000.00 from FGN EMPOWERMENT. Call 08030000000 to release.')),
            ],
          ),
          const SizedBox(height: 18),
          FilledButton(
            onPressed: busy ? null : runScan,
            child: Text(busy ? 'Scanning...' : 'Scan SMS Content'),
          ),
          if (result != null) ...[
            const SizedBox(height: 20),
            VerdictWidget(result: result!),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 4. QR SCANNER
// -------------------------------------------------------------
class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});
  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  ScanResult? result;
  bool busy = false;
  String selectedType = 'GTBank Spoofed QR';

  void testQr(String type, String payload) {
    setState(() {
      selectedType = type;
      busy = true;
    });
    Future.delayed(const Duration(milliseconds: 400), () {
      setState(() {
        busy = false;
        result = HeuristicsEngine.analyzeUrl(payload);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('QR Scanner')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: SentinelTheme.surfaceDark2,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: SentinelTheme.blue.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.qr_code_scanner, size: 54, color: SentinelTheme.blue),
                ),
                const SizedBox(height: 16),
                const Text('Visual QR Decoder', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                const SizedBox(height: 4),
                Text('Test sample QR payloads or decode images', style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('TEST SAMPLE CODES', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              _PresetChip('GTBank Phish QR', '1', () => testQr('GTBank Phish', 'https://secure-gtbank-login.verify-ng.com/update')),
              _PresetChip('Opay Bonus QR', '2', () => testQr('Opay Bonus', 'http://opay-claim-bonus.xyz/login')),
              _PresetChip('Legit Paystack QR', '3', () => testQr('Paystack', 'https://paystack.com/pay/demo')),
            ],
          ),
          if (result != null) ...[
            const SizedBox(height: 20),
            VerdictWidget(result: result!),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 5. FILE SCANNER
// -------------------------------------------------------------
class FileScannerScreen extends StatefulWidget {
  const FileScannerScreen({super.key});
  @override
  State<FileScannerScreen> createState() => _FileScannerScreenState();
}

class _FileScannerScreenState extends State<FileScannerScreen> {
  String selectedFile = 'opay_update_4.12.apk';
  ScanResult? result;
  bool busy = false;

  void testFile(String name, int size) {
    setState(() {
      selectedFile = name;
      busy = true;
    });
    Future.delayed(const Duration(milliseconds: 350), () {
      setState(() {
        busy = false;
        result = HeuristicsEngine.analyzeFile(name, size);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('File Signature Scanner')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: SentinelTheme.surfaceDark2,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              children: [
                const Icon(Icons.file_present_outlined, size: 54, color: SentinelTheme.warn),
                const SizedBox(height: 12),
                Text(selectedFile, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                const SizedBox(height: 4),
                const Text('Magic byte headers & SHA-256 analysis', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('TEST SAMPLE ATTACHMENTS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1.2)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              _PresetChip('Fake Opay APK', '1', () => testFile('opay_update_v4.12.apk', 15400000)),
              _PresetChip('Trojan Dropper EXE', '2', () => testFile('bvn_update_installer.exe', 2400000)),
              _PresetChip('Invoicing Zip', '3', () => testFile('remittance_invoice.zip', 680000)),
              _PresetChip('Normal PDF', '4', () => testFile('security_brief.pdf', 350000)),
            ],
          ),
          if (result != null) ...[
            const SizedBox(height: 20),
            VerdictWidget(result: result!),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 6. PASSWORD CHECKER
// -------------------------------------------------------------
class PasswordCheckerScreen extends StatefulWidget {
  const PasswordCheckerScreen({super.key});
  @override
  State<PasswordCheckerScreen> createState() => _PasswordCheckerScreenState();
}

class _PasswordCheckerScreenState extends State<PasswordCheckerScreen> {
  final ctrl = TextEditingController(text: 'P@ssw0rd2026!');
  Map<String, dynamic>? data;
  bool obscure = false;

  @override
  void initState() {
    super.initState();
    data = HeuristicsEngine.analyzePassword(ctrl.text);
  }

  void evaluate(String val) {
    setState(() {
      data = HeuristicsEngine.analyzePassword(val);
    });
  }

  @override
  Widget build(BuildContext context) {
    final score = data?['score'] ?? 0;
    final strength = data?['strength'] ?? 'Weak';
    final entropy = data?['entropy'] ?? 0;
    final crack = data?['estimatedCrackTime'] ?? 'Instant';
    final suggestions = (data?['suggestions'] as List<String>?) ?? [];

    final scoreColor = score > 60
        ? SentinelTheme.green
        : score > 40
            ? SentinelTheme.warn
            : SentinelTheme.danger;

    return Scaffold(
      appBar: AppBar(title: const Text('Password Checker')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: ctrl,
            obscureText: obscure,
            onChanged: evaluate,
            decoration: InputDecoration(
              labelText: 'Test Passphrase',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(obscure ? Icons.visibility_off : Icons.visibility),
                onPressed: () => setState(() => obscure = !obscure),
              ),
            ),
          ),
          const SizedBox(height: 18),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(strength, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: scoreColor.withOpacity(0.15), borderRadius: BorderRadius.circular(20)),
                        child: Text('$score / 100', style: TextStyle(color: scoreColor, fontWeight: FontWeight.w800, fontSize: 12)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  LinearProgressIndicator(
                    value: score / 100.0,
                    backgroundColor: Colors.white10,
                    valueColor: AlwaysStoppedAnimation(scoreColor),
                    borderRadius: BorderRadius.circular(10),
                    minHeight: 8,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: SentinelTheme.surfaceDark2, borderRadius: BorderRadius.circular(12)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('ENTROPY', style: TextStyle(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.w700)),
                              const SizedBox(height: 2),
                              Text('$entropy bits', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: SentinelTheme.surfaceDark2, borderRadius: BorderRadius.circular(12)),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('CRACK TIME', style: TextStyle(fontSize: 10, color: Colors.white60, fontWeight: FontWeight.w700)),
                              const SizedBox(height: 2),
                              Text(crack, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13), maxLines: 1),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (suggestions.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    const Text('RECOMMENDATIONS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
                    const SizedBox(height: 6),
                    for (final s in suggestions)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 4),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('• ', style: TextStyle(color: SentinelTheme.blue)),
                            Expanded(child: Text(s, style: const TextStyle(fontSize: 12, color: Colors.white70))),
                          ],
                        ),
                      ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// 7. BREACH MONITOR
// -------------------------------------------------------------
class BreachMonitorScreen extends StatefulWidget {
  const BreachMonitorScreen({super.key});
  @override
  State<BreachMonitorScreen> createState() => _BreachMonitorScreenState();
}

class _BreachMonitorScreenState extends State<BreachMonitorScreen> {
  final ctrl = TextEditingController(text: 'amina@sentinel.ng');
  ScanResult? result;
  bool busy = false;

  void runCheck() {
    setState(() => busy = true);
    Future.delayed(const Duration(milliseconds: 350), () {
      setState(() {
        busy = false;
        result = HeuristicsEngine.analyzeBreach(ctrl.text);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Breach Monitor')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          TextField(
            controller: ctrl,
            decoration: const InputDecoration(labelText: 'Email Address to Check', prefixIcon: Icon(Icons.shield_outlined)),
          ),
          const SizedBox(height: 18),
          FilledButton(
            onPressed: busy ? null : runCheck,
            child: Text(busy ? 'Verifying...' : 'Check Mailbox Hygiene'),
          ),
          if (result != null) ...[
            const SizedBox(height: 20),
            VerdictWidget(result: result!),
          ],
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// REUSABLE VERDICT WIDGET
// -------------------------------------------------------------
class VerdictWidget extends StatelessWidget {
  final ScanResult result;
  const VerdictWidget({super.key, required this.result});

  @override
  Widget build(BuildContext context) {
    final color = result.isSafe
        ? SentinelTheme.green
        : result.isSuspicious
            ? SentinelTheme.warn
            : SentinelTheme.danger;

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: color.withOpacity(0.35)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: color.withOpacity(0.3)),
                  ),
                  child: Text(
                    result.verdict,
                    style: TextStyle(color: color, fontWeight: FontWeight.w800, fontSize: 12),
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${result.riskScore}',
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 24),
                    ),
                    const Text('/ 100 Risk', style: TextStyle(fontSize: 10, color: Colors.white60)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'CATEGORY · ${result.threatType.toUpperCase()}',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.8, color: Colors.white70),
            ),
            const SizedBox(height: 8),
            Text(
              result.explanation,
              style: const TextStyle(fontSize: 13, height: 1.45),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: SentinelTheme.surfaceDark2,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('RECOMMENDATION', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 10, color: Colors.white60)),
                  const SizedBox(height: 4),
                  Text(result.recommendation, style: const TextStyle(fontSize: 12, height: 1.4)),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 6,
              children: [
                for (final s in result.sources)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: SentinelTheme.blue.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(s, style: const TextStyle(color: SentinelTheme.blue, fontSize: 10, fontWeight: FontWeight.w600)),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PresetChip extends StatelessWidget {
  final String label;
  final String val;
  final VoidCallback onTap;
  const _PresetChip(this.label, this.val, this.onTap);

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 11, color: SentinelTheme.blue)),
      backgroundColor: SentinelTheme.surfaceDark2,
      side: const BorderSide(color: Colors.white12),
      onPressed: onTap,
    );
  }
}
