<?php
/**
 * CAPTCHA Generator - ASCII Art Version
 * Generates CAPTCHA as ASCII art (fun alternative)
 * Returns plain text
 */

session_start();

define('CAPTCHA_LENGTH', 4);

function generateRandomString($length = CAPTCHA_LENGTH) {
    $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $string = '';
    for ($i = 0; $i < $length; $i++) {
        $string .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $string;
}

function toASCIIArt($text) {
    $asciiChars = [
        'A' => ['███ ', '█ █ ', '███ ', '█ █ ', '█ █ '],
        'B' => ['██  ', '█ █ ', '██  ', '█ █ ', '██  '],
        'C' => [' ██ ', '█   ', '█   ', '█   ', ' ██ '],
        'D' => ['██  ', '█ █ ', '█ █ ', '█ █ ', '██  '],
        'E' => ['███ ', '█   ', '██  ', '█   ', '███ '],
        'F' => ['███ ', '█   ', '██  ', '█   ', '█   '],
        'G' => [' ██ ', '█   ', '█ ██', '█ █ ', ' ██ '],
        'H' => ['█ █ ', '█ █ ', '███ ', '█ █ ', '█ █ '],
        '1' => [' █  ', '██  ', ' █  ', ' █  ', '███ '],
        '2' => ['██  ', '█ █ ', '  █ ', ' █  ', '███ '],
        '3' => ['██  ', '█ █ ', ' ██ ', '█ █ ', '██  '],
    ];
    
    $lines = array_fill(0, 5, '');
    for ($i = 0; $i < strlen($text); $i++) {
        $char = $text[$i];
        if (isset($asciiChars[$char])) {
            for ($line = 0; $line < 5; $line++) {
                $lines[$line] .= $asciiChars[$char][$line];
            }
        }
    }
    
    return implode("\n", $lines);
}

$captchaText = generateRandomString();
$_SESSION['captcha_code'] = strtoupper($captchaText);
$_SESSION['captcha_time'] = time();

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

echo toASCIIArt($captchaText);
?>
