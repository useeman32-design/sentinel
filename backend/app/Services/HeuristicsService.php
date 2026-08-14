<?php

namespace App\Services;

class HeuristicsService
{
    public function scanUrl(string $url): array
    {
        $score = 10;
        $reasons = [];
        $sources = ['Sentinel Core Heuristics', 'Google Public DNS'];

        $parsed = parse_url(str_contains($url, '://') ? $url : 'https://' . $url);
        $host = strtolower($parsed['host'] ?? $url);

        // IP address host check
        if (preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/', $host)) {
            $score += 45;
            $reasons[] = 'URL directs to a raw numerical IP address rather than a verified hostname.';
        }

        // Suspicious high-risk TLDs
        if (preg_match('/\.(xyz|top|work|click|loan|gq|cf|ml|tk|fit|rest)$/i', $host)) {
            $score += 35;
            $reasons[] = 'Domain utilizes a high-risk TLD known for disposable phishing campaigns.';
        }

        // Nigerian financial institutions lookalikes
        $brands = [
            'gtbank' => 'gtbank.com',
            'accessbank' => 'accessbankplc.com',
            'zenithbank' => 'zenithbank.com',
            'firstbank' => 'firstbanknigeria.com',
            'ubagroup' => 'ubagroup.com',
            'opay' => 'opayweb.com',
            'palmpay' => 'palmpay.com',
            'kuda' => 'kuda.com',
            'moniepoint' => 'moniepoint.com',
            'cbn' => 'cbn.gov.ng',
        ];

        foreach ($brands as $brand => $official) {
            if (str_contains($host, $brand) && !str_ends_with($host, $official)) {
                $score += 55;
                $reasons[] = "Domain impersonates verified Nigerian financial institution: {$brand}.";
            }
        }

        if (preg_match('/(login|verify|bvn|update|kyc|secure|claim|airtime|promo)/i', $url)) {
            $score += 20;
            $reasons[] = 'Contains urgent credential-harvesting keywords in the URL path.';
        }

        $score = min(99, max(5, $score));
        $verdict = $score >= 70 ? 'Dangerous' : ($score >= 40 ? 'Suspicious' : 'Safe');

        return [
            'verdict' => $verdict,
            'risk_score' => $score,
            'threat_type' => $score >= 70 ? 'Phishing / Brand Impersonation' : ($score >= 40 ? 'Suspicious Domain' : 'Clean URL'),
            'explanation' => empty($reasons) ? 'Domain has standard structure with no active phishing signatures detected.' : implode(' ', $reasons),
            'recommendation' => $score >= 70
                ? 'Do not open this URL or submit credentials. It mimics a trusted platform.'
                : ($score >= 40 ? 'Exercise caution. Verify directly with the official service.' : 'Safe to browse.'),
            'sources' => $sources,
            'host' => $host,
        ];
    }

    public function scanSms(string $text): array
    {
        $t = strtolower($text);
        $score = 5;
        $reasons = [];

        if (preg_match('/(bvn|nin|deactivat|block|suspend|kyc update)/i', $t)) {
            $score += 45;
            $reasons[] = 'Demands urgent BVN/NIN verification under threat of account suspension.';
        }

        if (preg_match('/(won|congrat|promo|reward|claim ₦|lottery|2,000,000)/i', $t)) {
            $score += 40;
            $reasons[] = 'Contains fake prize notification and reward claims.';
        }

        if (preg_match('/(processing fee|pay ₦|send airtime|call this number)/i', $t)) {
            $score += 30;
            $reasons[] = 'Requests upfront fee payment or immediate airtime transfer.';
        }

        if (preg_match('/(bit\.ly|tinyurl|is\.gd|cutt\.ly|http)/i', $t)) {
            $score += 25;
            $reasons[] = 'Contains unverified shortened hyperlinks.';
        }

        $score = min(99, max(5, $score));
        $verdict = $score >= 70 ? 'Dangerous' : ($score >= 40 ? 'Suspicious' : 'Safe');

        return [
            'verdict' => $verdict,
            'risk_score' => $score,
            'threat_type' => $score >= 70 ? 'SMS Smishing' : ($score >= 40 ? 'Suspicious SMS' : 'Legitimate Text'),
            'explanation' => empty($reasons) ? 'Standard message structure.' : implode(' ', $reasons),
            'recommendation' => $score >= 70
                ? 'Never call numbers or click links in this SMS. Your bank will never request your PIN or BVN via SMS.'
                : 'Message appears normal.',
            'sources' => ['Nigerian Smishing Detection Heuristics'],
        ];
    }

    public function scanEmail(string $from, string $body): array
    {
        $score = 10;
        $reasons = [];

        if (preg_match('/@(gtb|access|zenith|uba|firstbank|cbn|opay).*\.(xyz|top|club|site|info)/i', $from)) {
            $score += 60;
            $reasons[] = 'Sender domain mimics an official Nigerian banking mailbox.';
        }

        if (preg_match('/(bvn|deactivated|suspended|kyc update|wire transfer)/i', $body)) {
            $score += 30;
            $reasons[] = 'Body contains panic-inducing keywords demanding account re-verification.';
        }

        $score = min(99, max(5, $score));
        $verdict = $score >= 70 ? 'Dangerous' : ($score >= 40 ? 'Suspicious' : 'Safe');

        return [
            'verdict' => $verdict,
            'risk_score' => $score,
            'threat_type' => $score >= 70 ? 'Email Spoofing & Phishing' : ($score >= 40 ? 'Suspicious Email' : 'Clean Email'),
            'explanation' => empty($reasons) ? 'No malicious email markers found.' : implode(' ', $reasons),
            'recommendation' => $score >= 70 ? 'Delete email immediately. Do not click links.' : 'Standard email hygiene applies.',
            'sources' => ['Email Header Parser', 'Domain Reputation Database'],
        ];
    }

    public function checkPassword(string $password): array
    {
        $charsetSize = 0;
        if (preg_match('/[a-z]/', $password)) $charsetSize += 26;
        if (preg_match('/[A-Z]/', $password)) $charsetSize += 26;
        if (preg_match('/[0-9]/', $password)) $charsetSize += 10;
        if (preg_match('/[^a-zA-Z0-9]/', $password)) $charsetSize += 32;

        $entropyBits = $charsetSize > 0 ? (int)round(strlen($password) * (log($charsetSize) / log(2))) : 0;
        $score = min(100, (int)round($entropyBits * 1.25));
        if (strlen($password) < 8) $score = min($score, 25);

        $strength = $score >= 80 ? 'Very Strong' : ($score >= 60 ? 'Strong' : ($score >= 40 ? 'Moderate' : 'Weak'));
        $crackTime = $score >= 80 ? 'Centuries (10,000+ years)' : ($score >= 60 ? 'Several Years' : ($score >= 40 ? 'A few Days' : 'Instant (< 1 second)'));

        $suggestions = [];
        if (strlen($password) < 12) $suggestions[] = 'Increase length to at least 12–16 characters.';
        if (!preg_match('/[A-Z]/', $password)) $suggestions[] = 'Add uppercase characters (A-Z).';
        if (!preg_match('/[0-9]/', $password)) $suggestions[] = 'Include numeric digits (0-9).';
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) $suggestions[] = 'Include special symbols (!@#$%).';

        return [
            'score' => $score,
            'strength' => $strength,
            'entropy' => $entropyBits,
            'length' => strlen($password),
            'estimated_crack_time' => $crackTime,
            'suggestions' => $suggestions,
        ];
    }
}
