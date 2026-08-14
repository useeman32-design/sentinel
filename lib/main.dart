import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';
import 'screens/shell.dart';
import 'screens/auth.dart';

void main() => runApp(const SentinelApp());

class SentinelApp extends StatefulWidget {
  const SentinelApp({super.key});
  @override
  State<SentinelApp> createState() => _SentinelAppState();
}

class _SentinelAppState extends State<SentinelApp> {
  ThemeMode mode = ThemeMode.dark;
  bool loggedIn = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sentinel AI',
      debugShowCheckedModeBanner: false,
      themeMode: mode,
      theme: SentinelTheme.light(GoogleFonts.interTextTheme()),
      darkTheme: SentinelTheme.dark(GoogleFonts.interTextTheme(ThemeData.dark().textTheme)),
      home: loggedIn
          ? AppShell(
              onToggleTheme: () {
                setState(() {
                  mode = mode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
                });
              },
              onLogout: () => setState(() => loggedIn = false),
            )
          : Splash(
              onEnter: () => setState(() => loggedIn = true),
            ),
    );
  }
}
