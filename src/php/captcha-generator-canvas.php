<?php
/**
 * CAPTCHA Generator - HTML Canvas Version
 * Generates CAPTCHA in HTML with JavaScript canvas rendering
 * Returns interactive HTML element
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

header('Content-Type: text/html');
header('Cache-Control: no-cache, no-store, must-revalidate');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { margin: 0; padding: 10px; }
        canvas { 
            border: 1px solid #ddd;
            display: block;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <canvas id="captchaCanvas" width="250" height="80"></canvas>
    
    <script>
        const canvas = document.getElementById('captchaCanvas');
        const ctx = canvas.getContext('2d');
        const text = '<?php echo addslashes($captchaText); ?>';
        
        function drawCaptcha() {
            // Clear canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw border
            ctx.strokeStyle = '#ddd';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            
            // Draw noise lines
            ctx.strokeStyle = 'lightgray';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }
            
            // Draw noise dots
            ctx.fillStyle = 'gray';
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.fillRect(x, y, 2, 2);
            }
            
            // Draw text
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            
            const charWidth = canvas.width / text.length;
            for (let i = 0; i < text.length; i++) {
                const x = charWidth * i + charWidth / 2;
                const y = canvas.height / 2 + 10;
                const angle = (Math.random() - 0.5) * 0.3;
                
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillText(text[i], 0, 0);
                ctx.restore();
            }
        }
        
        drawCaptcha();
        
        // Refresh on click
        canvas.addEventListener('click', function() {
            location.reload();
        });
    </script>
</body>
</html>
