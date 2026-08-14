import 'package:flutter/material.dart';
import 'theme.dart';
import 'screens/shell.dart';
import 'screens/auth.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SentinelApp());
}

class SentinelApp extends StatefulWidget {
  const SentinelApp({super.key});

  @override
  State<SentinelApp> createState() => _SentinelAppState();
}

class _SentinelAppState extends State<SentinelApp> {
  ThemeMode themeMode = ThemeMode.dark;
  bool loggedIn = true; // Auto-logged in for quick preview / development

  void toggleTheme() {
    setState(() {
      themeMode = themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void login() {
    setState(() => loggedIn = true);
  }

  void logout() {
    setState(() => loggedIn = false);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sentinel AI',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: SentinelTheme.light(),
      darkTheme: SentinelTheme.dark(),
      home: loggedIn
          ? AppShell(
              onToggleTheme: toggleTheme,
              onLogout: logout,
            )
          : Splash(
              onEnter: login,
            ),
    );
  }
}
