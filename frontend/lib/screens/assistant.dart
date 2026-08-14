import 'package:flutter/material.dart';
import '../services/gemini_service.dart';
import '../theme.dart';

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final TextEditingController ctrl = TextEditingController();
  final ScrollController scroll = ScrollController();
  bool busy = false;

  final List<Map<String, String>> messages = [
    {
      'role': 'ai',
      'text':
          'Hello! I am your Sentinel AI Security Advisor. Ask about scams, account takeover protection, or suspicious messages in Nigeria.',
    },
  ];

  final List<String> starters = [
    'How do I secure my WhatsApp?',
    'How do scammers steal bank accounts?',
    'What is a SIM swap attack?',
    'Is this message a scam?',
  ];

  void sendMessage(String query) async {
    final q = query.trim();
    if (q.isEmpty || busy) return;
    ctrl.clear();

    setState(() {
      messages.add({'role': 'user', 'text': q});
      busy = true;
    });

    _scrollToEnd();

    final response = await GeminiService.askAdvisor(q);

    if (mounted) {
      setState(() {
        messages.add({'role': 'ai', 'text': response});
        busy = false;
      });
      _scrollToEnd();
    }
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (scroll.hasClients) {
        scroll.animateTo(
          scroll.position.maxScrollExtent + 80,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    ctrl.dispose();
    scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
            child: Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AI Security Advisor',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
                    ),
                    Text(
                      'Autonomous cybersecurity intelligence',
                      style: TextStyle(color: Theme.of(context).hintColor, fontSize: 12),
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: SentinelTheme.green.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text('Live', style: TextStyle(color: SentinelTheme.green, fontSize: 11, fontWeight: FontWeight.w800)),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Colors.white10),
          Expanded(
            child: ListView.builder(
              controller: scroll,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: messages.length + (busy ? 1 : 0),
              itemBuilder: (ctx, i) {
                if (i == messages.length && busy) {
                  return const Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(strokeWidth: 2.5, color: SentinelTheme.green),
                      ),
                    ),
                  );
                }
                final m = messages[i];
                final isUser = m['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
                    decoration: BoxDecoration(
                      color: isUser
                          ? SentinelTheme.green.withOpacity(0.2)
                          : SentinelTheme.surfaceDark2,
                      borderRadius: BorderRadius.circular(18).copyWith(
                        bottomRight: isUser ? const Radius.circular(4) : const Radius.circular(18),
                        bottomLeft: !isUser ? const Radius.circular(4) : const Radius.circular(18),
                      ),
                      border: Border.all(
                        color: isUser
                            ? SentinelTheme.green.withOpacity(0.3)
                            : Colors.white10,
                      ),
                    ),
                    child: Text(
                      m['text'] ?? '',
                      style: const TextStyle(fontSize: 13, height: 1.45),
                    ),
                  ),
                );
              },
            ),
          ),
          // Starters
          SizedBox(
            height: 38,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: starters.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                return ActionChip(
                  label: Text(starters[i], style: const TextStyle(fontSize: 11, color: SentinelTheme.blue)),
                  backgroundColor: SentinelTheme.surfaceDark2,
                  side: const BorderSide(color: Colors.white12),
                  onPressed: () => sendMessage(starters[i]),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          // Composer
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: ctrl,
                    decoration: const InputDecoration(
                      hintText: 'Ask Sentinel Advisor...',
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                    onSubmitted: sendMessage,
                  ),
                ),
                const SizedBox(width: 10),
                IconButton.filled(
                  style: IconButton.filledStyleFrom(
                    backgroundColor: SentinelTheme.green,
                    foregroundColor: const Color(0xFF04110B),
                  ),
                  onPressed: () => sendMessage(ctrl.text),
                  icon: const Icon(Icons.arrow_upward),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
