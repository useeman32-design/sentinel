import 'package:flutter/material.dart';

class SentinelTheme {
  static const green = Color(0xFF00FF88);
  static const blue = Color(0xFF00C8FF);
  static const bg = Color(0xFF0B1220);
  static const surface = Color(0xFF111827);

  static ThemeData dark(TextTheme text) {
    final base = ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bg,
      colorScheme: const ColorScheme.dark(
        primary: green,
        secondary: blue,
        surface: surface,
      ),
      useMaterial3: true,
    );
    return base.copyWith(
      textTheme: text.apply(bodyColor: const Color(0xFFF4F7FB), displayColor: const Color(0xFFF4F7FB)),
    );
  }

  static ThemeData light(TextTheme text) {
    final base = ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF4F7FB),
      colorScheme: const ColorScheme.light(
        primary: Color(0xFF059669),
        secondary: Color(0xFF0284C7),
        surface: Colors.white,
      ),
      useMaterial3: true,
    );
    return base.copyWith(textTheme: text.apply(bodyColor: const Color(0xFF0B1220)));
  }
}
