<?php
/**
 * CAPTCHA Generator - SVG-based (No GD Library Required)
 * Generates a random CAPTCHA and stores in session
 * Returns SVG image
 */

session_start();

// CAPTCHA Configuration
define('CAPTCHA_LENGTH', 6);

// Generate random string
function generateRandomString($length = CAPTCHA_LENGTH) {
    $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $string = '';
    for ($i = 0; $i < $length; $i++) {
        $string .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $string;
    // return "ABCDEF";
}

// Generate CAPTCHA SVG
function generateCaptchaSVG($text) {
    $width = 250;
    $height = 80;
    
    $svg = '<?xml version="1.0" encoding="UTF-8"?>';
    $svg .= '<svg width="' . $width . '" height="' . $height . '" xmlns="http://www.w3.org/2000/svg">';
    
    // Background
    $svg .= '<rect width="' . $width . '" height="' . $height . '" fill="white"/>';
    
    // Add noise lines
    for ($i = 0; $i < 5; $i++) {
        $x1 = rand(0, $width);
        $y1 = rand(0, $height);
        $x2 = rand(0, $width);
        $y2 = rand(0, $height);
        $svg .= '<line x1="' . $x1 . '" y1="' . $y1 . '" x2="' . $x2 . '" y2="' . $y2 . '" stroke="lightgray" stroke-width="1"/>';
    }
    
    // Add noise dots
    for ($i = 0; $i < 30; $i++) {
        $cx = rand(0, $width);
        $cy = rand(0, $height);
        $svg .= '<circle cx="' . $cx . '" cy="' . $cy . '" r="1" fill="gray"/>';
    }
    
    // Add text with slight rotation
    $charWidth = $width / strlen($text);
    $baseX = $charWidth / 2;
    
    for ($i = 0; $i < strlen($text); $i++) {
        $rotation = rand(-15, 15);
        $x = $baseX + ($i * $charWidth);
        $y = $height / 2 + 10;
        
        $svg .= '<text x="' . $x . '" y="' . $y . '" ';
        $svg .= 'font-size="28" font-weight="bold" ';
        $svg .= 'text-anchor="middle" ';
        $svg .= 'fill="black" ';
        $svg .= 'transform="rotate(' . $rotation . ' ' . $x . ' ' . $y . ')" ';
        $svg .= 'font-family="Arial, sans-serif">';
        $svg .= htmlspecialchars($text[$i]);
        $svg .= '</text>';
    }
    
    $svg .= '</svg>';
    return $svg;
}

// Generate CAPTCHA
$captchaText = generateRandomString();

// Store in session
$_SESSION['captcha_code'] = strtoupper($captchaText);
$_SESSION['captcha_time'] = time();

// Return SVG
header('Content-Type: image/svg+xml');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

echo generateCaptchaSVG($captchaText);
?>
