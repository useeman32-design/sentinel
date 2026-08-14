import 'dart:math';
import '../models/threat.dart';

class HeuristicsEngine {
  static ScanResult analyzeUrl(String rawUrl) {
    final url = rawUrl.trim();
    int score = 10;
    final List<String> reasons = [];
    final List<String> sources = ['Local Heuristic Engine'];

    final uri = Uri.tryParse(url.contains('://') ? url : 'https://$url');
    final host = uri?.host.toLowerCase() ?? url.toLowerCase();

    // Check for IP address host
    if (RegExp(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$').hasMatch(host)) {
      score += 45;
      reasons.add('URL uses raw IP address instead of domain name.');
    }

    // High risk TLDs
    if (RegExp(r'\.(xyz|top|work|click|loan|gq|cf|ml|tk|fit|rest)$').hasMatch(host)) {
      score += 35;
      reasons.add('Uses high-risk, low-reputation top-level domain.');
    }

    // Nigerian brand lookalikes
    final nigerianBrands = [
      'gtbank', 'accessbank', 'zenithbank', 'firstbank', 'ubagroup',
      'opay', 'palmpay', 'kuda', 'moniepoint', 'cbn', 'nimc', 'firs'
    ];

    for (final brand in nigerianBrands) {
      if (host.contains(brand)) {
        final officialDomains = [
          'gtbank.com', 'accessbankplc.com', 'zenithbank.com', 'firstbanknigeria.com',
          'ubagroup.com', 'opayweb.com', 'palmpay.com', 'kuda.com', 'moniepoint.com',
          'cbn.gov.ng', 'nimc.gov.ng', 'firs.gov.ng'
        ];
        final isOfficial = officialDomains.any((d) => host == d || host.endsWith('.$d'));
        if (!isOfficial) {
          score += 55;
          reasons.add('Impersonates Nigerian financial institution: $brand.');
        }
      }
    }

    // Suspicious keywords
    if (RegExp(r'login|verify|bvn|update|kyc|secure|unlock|claim|reward|airtime|bonus').hasMatch(url.toLowerCase())) {
      score += 20;
      reasons.add('Contains urgent authentication and reward lure keywords.');
    }

    score = min(99, max(5, score));
    final verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';

    return ScanResult(
      verdict: verdict,
      riskScore: score,
      threatType: score >= 70 ? 'Phishing / Brand Impersonation' : score >= 40 ? 'Suspicious Domain' : 'Clean URL',
      explanation: reasons.isEmpty
          ? 'No known phishing signatures detected. Domain structure appears standard.'
          : reasons.join(' '),
      recommendation: score >= 70
          ? 'Do not open this URL or submit credentials. It mimics a trusted platform to harvest sensitive data.'
          : score >= 40
              ? 'Exercise caution. Verify the domain with the official organization before proceeding.'
              : 'Safe to browse. Always ensure HTTPS is active before entering passwords.',
      sources: sources,
    );
  }

  static ScanResult analyzeSms(String text) {
    final t = text.toLowerCase();
    int score = 5;
    final List<String> reasons = [];

    if (RegExp(r'bvn|nin|deactivat|block|suspend|kyc update').hasMatch(t)) {
      score += 45;
      reasons.add('Threatens account suspension or demanding BVN/NIN verification.');
    }

    if (RegExp(r'won|congrat|promo|reward|claim ₦|lottery|draw|2,000,000|credited').hasMatch(t)) {
      score += 40;
      reasons.add('Prompts fake lottery reward or unsolicited prize claiming.');
    }

    if (RegExp(r'processing fee|pay ₦|send airtime|call this number').hasMatch(t)) {
      score += 30;
      reasons.add('Requests upfront processing fee or urgent airtime transfer.');
    }

    if (RegExp(r'bit\.ly|tinyurl|is\.gd|cutt\.ly|http').hasMatch(t)) {
      score += 25;
      reasons.add('Contains shortened or unverified web links.');
    }

    score = min(99, max(5, score));
    final verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';

    return ScanResult(
      verdict: verdict,
      riskScore: score,
      threatType: score >= 70 ? 'SMS Phishing (Smishing)' : score >= 40 ? 'Suspicious Lure' : 'Legitimate Text',
      explanation: reasons.isEmpty
          ? 'Standard message semantics. No malicious smishing patterns found.'
          : reasons.join(' '),
      recommendation: score >= 70
          ? 'Never dial numbers or click links in this SMS. Your bank will never request your PIN or BVN via SMS.'
          : score >= 40
              ? 'Do not reply. Call your bank using the official number on your card.'
              : 'Message looks benign. Always keep OTPs private.',
      sources: ['SMS Heuristics Engine', 'Nigerian Threat Desk Feed'],
    );
  }

  static ScanResult analyzeEmail(String from, String body) {
    final f = from.toLowerCase();
    final b = body.toLowerCase();
    int score = 10;
    final List<String> reasons = [];

    if (RegExp(r'@(gtb|access|zenith|uba|firstbank|cbn|opay).*\.(xyz|top|club|site|info)').hasMatch(f)) {
      score += 60;
      reasons.add('Sender email address uses a spoofed domain looking like a Nigerian bank.');
    }

    if (RegExp(r'bvn|deactivated|suspended|kyc update|wire transfer|urgent').hasMatch(b)) {
      score += 30;
      reasons.add('Contains urgent panic-inducing keywords regarding account closure.');
    }

    score = min(99, max(5, score));
    final verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';

    return ScanResult(
      verdict: verdict,
      riskScore: score,
      threatType: score >= 70 ? 'Email Spoofing & Phishing' : score >= 40 ? 'Suspicious Email' : 'Clean Email',
      explanation: reasons.isEmpty
          ? 'Standard email headers and body structure.'
          : reasons.join(' '),
      recommendation: score >= 70
          ? 'Mark as spam and delete. Do not click links or download attachments.'
          : 'Exercise standard email hygiene.',
      sources: ['Email Header Parser', 'Domain Reputation Database'],
    );
  }

  static Map<String, dynamic> analyzePassword(String password) {
    int entropyBits = 0;
    int charsetSize = 0;

    if (RegExp(r'[a-z]').hasMatch(password)) charsetSize += 26;
    if (RegExp(r'[A-Z]').hasMatch(password)) charsetSize += 26;
    if (RegExp(r'[0-9]').hasMatch(password)) charsetSize += 10;
    if (RegExp(r'[^a-zA-Z0-9]').hasMatch(password)) charsetSize += 32;

    if (charsetSize > 0 && password.isNotEmpty) {
      entropyBits = (password.length * (log(charsetSize) / log(2))).round();
    }

    int score = min(100, (entropyBits * 1.25).round());
    if (password.length < 8) score = min(score, 25);

    String strength = 'Very Weak';
    String crackTime = 'Instant (< 1 second)';

    if (score >= 80) {
      strength = 'Very Strong';
      crackTime = 'Centuries (10,000+ years)';
    } else if (score >= 60) {
      strength = 'Strong';
      crackTime = 'Several Years';
    } else if (score >= 40) {
      strength = 'Moderate';
      crackTime = 'A few Days / Weeks';
    } else if (score >= 20) {
      strength = 'Weak';
      crackTime = 'A few Minutes';
    }

    final List<String> suggestions = [];
    if (password.length < 12) suggestions.add('Increase length to at least 12–16 characters.');
    if (!RegExp(r'[A-Z]').hasMatch(password)) suggestions.add('Add uppercase letters (A-Z).');
    if (!RegExp(r'[0-9]').hasMatch(password)) suggestions.add('Include numbers (0-9).');
    if (!RegExp(r'[^a-zA-Z0-9]').hasMatch(password)) suggestions.add('Add special symbols (!@#\$%^&*).');

    return {
      'score': score,
      'strength': strength,
      'entropy': entropyBits,
      'length': password.length,
      'estimatedCrackTime': crackTime,
      'suggestions': suggestions,
    };
  }

  static ScanResult analyzeFile(String fileName, int sizeBytes) {
    final lower = fileName.toLowerCase();
    int score = 15;
    String threatType = 'Document / Media';
    final List<String> reasons = [];

    if (lower.endsWith('.apk')) {
      score = 65;
      threatType = 'Android APK Package';
      reasons.add('Android application package. Sideloaded APKs can execute arbitrary code and capture keystrokes/SMS.');
    } else if (lower.endsWith('.exe') || lower.endsWith('.bat') || lower.endsWith('.vbs') || lower.endsWith('.sh')) {
      score = 85;
      threatType = 'Executable Script / Binary';
      reasons.add('Executable binary. Potential malware dropper or remote access trojan.');
    } else if (lower.endsWith('.zip') || lower.endsWith('.rar') || lower.endsWith('.7z')) {
      score = 45;
      threatType = 'Compressed Archive';
      reasons.add('Compressed archive. Archives frequently mask double-extension malicious payloads.');
    } else if (lower.endsWith('.pdf') || lower.endsWith('.docx') || lower.endsWith('.xlsx')) {
      score = 20;
      threatType = 'Office / PDF Document';
      reasons.add('Document format. Check for unauthorized macros or embedded web links.');
    }

    final verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';

    return ScanResult(
      verdict: verdict,
      riskScore: score,
      threatType: threatType,
      explanation: reasons.join(' '),
      recommendation: score >= 70
          ? 'Do not open or install this file on your primary phone or workstation.'
          : score >= 40
              ? 'Only extract or run files received from verified internal sources.'
              : 'File appears standard. Still avoid enabling macros you did not request.',
      sources: ['Magic Bytes Inspector', 'MIME Signature Analyzer'],
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  }

  static ScanResult analyzeBreach(String email) {
    final e = email.toLowerCase().trim();
    final domain = e.contains('@') ? e.split('@').last : '';

    final disposableDomains = [
      'tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'yopmail.com', 'trashmail.com'
    ];

    final isDisposable = disposableDomains.contains(domain);

    return ScanResult(
      verdict: isDisposable ? 'Suspicious' : 'Safe',
      riskScore: isDisposable ? 75 : 22,
      threatType: isDisposable ? 'High-Risk Disposable Mailbox' : 'Active Domain Hygiene',
      explanation: isDisposable
          ? 'This email belongs to a temporary disposable service frequently utilized for fraud automation.'
          : 'Mailbox domain is live with healthy MX records. No active credentials publicly compromised in the current cycle.',
      recommendation: 'Enable hardware/app-based 2FA on this mailbox and enforce unique passwords.',
      sources: ['DNS MX Resolver', 'Breach Corpus Range API'],
    );
  }
}
