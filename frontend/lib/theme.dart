import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SentinelTheme {
  static const green = Color(0xFF00FF88);
  static const blue = Color(0xFF00C8FF);
  static const purple = Color(0xFFA78BFA);
  static const warn = Color(0xFFFFB020);
  static const danger = Color(0xFFFF4D6D);

  static const bgDark = Color(0xFF070B14);
  static const surfaceDark = Color(0xFF111827);
  static const surfaceDark2 = Color(0xFF162033);
  static const textDark = Color(0xFFF4F7FB);
  static const mutedDark = Color(0xFF8B97AB);

  static const bgLight = Color(0xFFF3F6FB);
  static const surfaceLight = Color(0xFFFFFFFF);
  static const surfaceLight2 = Color(0xFFEAF0F8);
  static const textLight = Color(0xFF0B1220);
  static const mutedLight = Color(0xFF64748B);

  static ThemeData dark() {
    final base = ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgDark,
      useMaterial3: true,
      colorScheme: const ColorScheme.dark(
        primary: green,
        secondary: blue,
        surface: surfaceDark,
        error: danger,
      ),
      cardTheme: const CardTheme(
        color: surfaceDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(18)),
          side: BorderSide(color: Colors.white10),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceDark2,
        hintStyle: const TextStyle(color: mutedDark, fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.white12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Colors.white12),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: blue, width: 1.5),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: green,
          foregroundColor: const Color(0xFF04110B),
          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
        ),
      ),
    );

    try {
      return base.copyWith(
        textTheme: GoogleFonts.plusJakartaSansTextTheme(base.textTheme).apply(
          bodyColor: textDark,
          displayColor: textDark,
        ),
      );
    } catch (_) {
      return base.copyWith(
        textTheme: base.textTheme.apply(
          bodyColor: textDark,
          displayColor: textDark,
        ),
      );
    }
  }

  static ThemeData light() {
    final base = ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: bgLight,
      useMaterial3: true,
      colorScheme: const ColorScheme.light(
        primary: Color(0xFF059669),
        secondary: Color(0xFF0284C7),
        surface: surfaceLight,
        error: Color(0xFFDC2626),
      ),
      cardTheme: const CardTheme(
        color: surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(18)),
          side: BorderSide(color: Color(0x1A0F172A)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceLight2,
        hintStyle: const TextStyle(color: mutedLight, fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0x1A0F172A)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0x1A0F172A)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFF0284C7), width: 1.5),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: const Color(0xFF059669),
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
        ),
      ),
    );

    try {
      return base.copyWith(
        textTheme: GoogleFonts.plusJakartaSansTextTheme(base.textTheme).apply(
          bodyColor: textLight,
          displayColor: textLight,
        ),
      );
    } catch (_) {
      return base.copyWith(
        textTheme: base.textTheme.apply(
          bodyColor: textLight,
          displayColor: textLight,
        ),
      );
    }
  }
}
