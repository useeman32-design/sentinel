class ScanResult {
  final String verdict; // 'Safe', 'Suspicious', 'Dangerous'
  final int riskScore; // 0 - 100
  final String threatType;
  final String explanation;
  final String recommendation;
  final List<String> sources;
  final String? payload;
  final String? hash;

  const ScanResult({
    required this.verdict,
    required this.riskScore,
    required this.threatType,
    required this.explanation,
    required this.recommendation,
    required this.sources,
    this.payload,
    this.hash,
  });

  bool get isSafe => verdict == 'Safe';
  bool get isSuspicious => verdict == 'Suspicious';
  bool get isDangerous => verdict == 'Dangerous';
}

class ThreatCampaign {
  final String title;
  final String severity; // 'Critical', 'High', 'Medium'
  final String category;
  final String region;
  final String description;
  final String time;

  const ThreatCampaign({
    required this.title,
    required this.severity,
    required this.category,
    required this.region,
    required this.description,
    required this.time,
  });
}

class NotificationItem {
  final String id;
  final String kind;
  final String title;
  final String body;
  final String time;
  final String tone; // 'chip-bad', 'chip-warn', 'chip-safe', 'chip-info'
  bool seen;

  NotificationItem({
    required this.id,
    required this.kind,
    required this.title,
    required this.body,
    required this.time,
    required this.tone,
    this.seen = false,
  });
}

class AcademyCourse {
  final String id;
  final String title;
  final String blurb;
  final int lessonsCount;
  final int progress;
  final List<LessonItem> items;

  const AcademyCourse({
    required this.id,
    required this.title,
    required this.blurb,
    required this.lessonsCount,
    required this.progress,
    required this.items,
  });
}

class LessonItem {
  final String title;
  final String body;

  const LessonItem({
    required this.title,
    required this.body,
  });
}
