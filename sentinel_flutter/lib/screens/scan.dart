import 'package:flutter/material.dart';

class ScanHub extends StatelessWidget {
  const ScanHub({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      (Icons.link, 'Link', 'Live DNS + phishing feed', Colors.cyan),
      (Icons.mail_outline, 'Email', 'Header + link inspection', Colors.greenAccent),
      (Icons.sms_outlined, 'SMS', 'Scam families + URLs', Colors.purpleAccent),
      (Icons.qr_code_2, 'QR', 'Decode then reputation', Colors.lightBlue),
      (Icons.insert_drive_file_outlined, 'File', 'Magic bytes + hash', Colors.amber),
      (Icons.lock_outline, 'Password', 'Entropy + HIBP', Colors.tealAccent),
      (Icons.warning_amber, 'Breach', 'MX + mailbox hygiene', Colors.redAccent),
    ];
    return SafeArea(
      child: GridView.count(
        padding: const EdgeInsets.all(20),
        crossAxisCount: MediaQuery.sizeOf(context).width > 700 ? 4 : 2,
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        children: [
          for (final it in items)
            Card(
              child: InkWell(
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ScannerPage(title: it.$2))),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Icon(it.$1, color: it.$4),
                    const Spacer(),
                    Text(it.$2, style: const TextStyle(fontWeight: FontWeight.w800)),
                    Text(it.$3, style: const TextStyle(fontSize: 11)),
                  ]),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class ScannerPage extends StatefulWidget {
  final String title;
  const ScannerPage({super.key, required this.title});
  @override
  State<ScannerPage> createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  final ctrl = TextEditingController();
  String? result;
  bool busy = false;

  Future<void> run() async {
    setState(() => busy = true);
    await Future<void>.delayed(const Duration(milliseconds: 400));
    final text = ctrl.text.toLowerCase();
    final bad = RegExp(r'otp|bvn|won|bit\.ly|verify|login').hasMatch(text);
    setState(() {
      busy = false;
      result = bad ? 'Dangerous · do not continue' : 'No high-risk pattern in this input';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.title} scanner')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(controller: ctrl, maxLines: 4, decoration: const InputDecoration(border: OutlineInputBorder(), hintText: 'Paste URL, SMS or email')),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(onPressed: busy ? null : run, child: Text(busy ? 'Scanning…' : 'Scan now')),
            ),
            if (result != null) ...[
              const SizedBox(height: 16),
              Card(child: ListTile(title: Text(result!))),
            ],
          ],
        ),
      ),
    );
  }
}
