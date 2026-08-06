<?php
/**
 * CAPTCHA Generator - Text-Only Version (Simplest)
 * Generates plaintext CAPTCHA code in session
 * Returns JSON - useful for CLI testing or accessibility
 */

session_start();

define('CAPTCHA_LENGTH', 6);

function generateRandomString($length = CAPTCHA_LENGTH) {
    $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $string = '';
    for ($i = 0; $i < $length; $i++) {
        $string .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $string;
}

$captchaText = generateRandomString();
$_SESSION['captcha_code'] = strtoupper($captchaText);
$_SESSION['captcha_time'] = time();

header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');

echo json_encode([
    'code' => $captchaText,
    'type' => 'text',
    'length' => strlen($captchaText)
]);
?>
