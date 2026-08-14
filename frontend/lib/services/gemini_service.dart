class GeminiService {
  static const sentinelSystemPrompt = '''
You are Sentinel AI, an autonomous cybersecurity advisor specialized in defending Nigerian individuals and businesses from cyber fraud, social engineering, SIM swaps, BVN/NIN scams, and digital identity theft.
Provide clear, actionable, and reassuring guidance. Never encourage interacting with suspicious links or paying extortion fees.
''';

  static Future<String> askAdvisor(String question) async {
    await Future<void>.delayed(const Duration(milliseconds: 600));

    final q = question.toLowerCase();
    if (q.contains('whatsapp') || q.contains('hack')) {
      return 'To secure your WhatsApp:\n1. Open WhatsApp Settings > Account > Two-Step Verification > Enable.\n2. Set a 6-digit PIN and recovery email.\n3. Never share your 6-digit SMS registration code with anyone.\n4. Go to Linked Devices and log out of any sessions you do not recognize.';
    } else if (q.contains('bvn') || q.contains('bank') || q.contains('otp')) {
      return 'Critical Rule: No Nigerian bank, Central Bank of Nigeria (CBN), or telecom company will ever call, SMS, or WhatsApp you asking for your BVN, Debit Card PIN, or OTP.\nIf you received such an alert threatening account deactivation, hang up immediately and verify with your bank branch.';
    } else if (q.contains('sim') || q.contains('swap')) {
      return 'A SIM swap occurs when fraudsters convince your mobile operator to port your phone number to their SIM card.\nWarning signs: sudden loss of cellular signal and inability to make calls or receive SMS.\nImmediate action: Call your telecom customer care from another line to freeze your number and notify your bank to suspend mobile USSD banking.';
    } else if (q.contains('ransomware') || q.contains('malware')) {
      return 'Ransomware encrypts your files and demands payment. Never pay the ransom as recovery is never guaranteed.\nPrevention:\n1. Maintain offline encrypted backups.\n2. Never sideload untrusted APKs from Telegram.\n3. Keep operating systems and banking apps updated.';
    }

    return 'I analyzed your query regarding "$question". Always verify unexpected transfer requests by voice calling the sender on a known phone number. Never click shortened URLs or input banking credentials on unverified web pages.';
  }
}
