<?php
session_start();

const ALTCHA_HMAC_KEY   = '36cb4f86280332f820421003871d531e573d26a0230432923b373eb3451eb3f3'; 
const ALTCHA_MAX_NUMBER = 100000;
const MAX_REGISTER_FAILS = 5;
const AUDIO_PATH        = __DIR__ . '/audio/'; 

// Initialize failure counter
if (!isset($_SESSION['failed_attempts'])) {
    $_SESSION['failed_attempts'] = 0;
}

// Check if hard CAPTCHA mode is triggered
if ($_SESSION['failed_attempts'] >= MAX_REGISTER_FAILS) {
	$requiresCaptcha = true; 
} else {
	$requiresCaptcha = false;
}


// ============================================================================
// 1. ENDPOINT A: Dynamic Image Generator (PHP GD)
// ============================================================================
if (isset($_GET['action']) && $_GET['action'] === 'captcha_img') {
    header('Content-Type: image/png');
    
    if (isset($_GET['refresh']) || empty($_SESSION['captcha_code'])) {
        $_SESSION['captcha_code'] = substr(str_shuffle('23456789ABCDEFGHJKLMNPQRSTUVWXYZ'), 0, 5);
    }
    
    $code = $_SESSION['captcha_code'];

    $image = imagecreatetruecolor(140, 45);
    $bg = imagecolorallocate($image, 245, 247, 250);
    $textColor = imagecolorallocate($image, 15, 23, 42);
    $lineColor = imagecolorallocate($image, 203, 213, 225);

    imagefill($image, 0, 0, $bg);
    for ($i = 0; $i < 5; $i++) {
        imageline($image, rand(0, 140), rand(0, 45), rand(0, 140), rand(0, 45), $lineColor);
    }
    imagestring($image, 5, 45, 14, $code, $textColor);
    imagepng($image);
    imagedestroy($image); // <-- Unnecessary in PHP 8+, safe to delete
    exit;
}


// ============================================================================
// 2. ENDPOINT B: Securimage WAV Audio Generator (Overlay Noise in Background)
// ============================================================================
if (isset($_GET['action']) && $_GET['action'] === 'captcha_audio') {
    $code = $_SESSION['captcha_code'] ?? '';
    
    if (empty($code)) {
        http_response_code(404);
        exit;
    }

    $sampleRate = 11025;
    $bitsPerSample = 16;
    $numChannels = 1;

    $parseWav = function($filePath) {
        $fp = @fopen($filePath, 'rb');
        if (!$fp) return false;

        $header = fread($fp, 12);
        if (substr($header, 0, 4) !== 'RIFF' || substr($header, 8, 4) !== 'WAVE') {
            fclose($fp);
            return false;
        }

        $sampleRate = 11025;
        $numChannels = 1;
        $bitsPerSample = 16;
        $dataOffset = 44;
        $dataSize = 0;

        while (!feof($fp)) {
            $chunkHeader = fread($fp, 8);
            if (strlen($chunkHeader) < 8) break;

            $chunkId = substr($chunkHeader, 0, 4);
            $chunkSize = unpack('Vsize', substr($chunkHeader, 4, 4))['size'];

            if ($chunkId === 'fmt ') {
                $fmtData = fread($fp, $chunkSize);
                $fmt = unpack('vformat/vchannels/Vrate/Vbytessec/valign/vbits', $fmtData);
                $numChannels   = $fmt['channels'];
                $sampleRate    = $fmt['rate'];
                $bitsPerSample = $fmt['bits'];
            } elseif ($chunkId === 'data') {
                $dataOffset = ftell($fp);
                $dataSize = $chunkSize;
                break;
            } else {
                fseek($fp, $chunkSize, SEEK_CUR);
            }
        }
        fclose($fp);

        return [
            'offset'   => $dataOffset,
            'size'     => $dataSize,
            'rate'     => $sampleRate,
            'channels' => $numChannels,
            'bits'     => $bitsPerSample
        ];
    };

    $getAudioPath = function($name) {
        $possible = [
            AUDIO_PATH . $name . '.wav',
            AUDIO_PATH . strtoupper($name) . '.wav',
            AUDIO_PATH . strtolower($name) . '.wav',
            AUDIO_PATH . 'noise/' . $name . '.wav',
            AUDIO_PATH . 'noise.wav'
        ];
        foreach ($possible as $path) {
            if (file_exists($path)) return $path;
        }
        return false;
    };

    $rawVoicePcm = '';
    $firstChar = true;

    foreach (str_split($code) as $char) {
        $filePath = $getAudioPath($char);

        if ($filePath) {
            $info = $parseWav($filePath);
            if ($info && $info['size'] > 0) {
                $sampleRate    = $info['rate'];
                $numChannels   = $info['channels'];
                $bitsPerSample = $info['bits'];
                $bytesPerFrame = $numChannels * ($bitsPerSample / 8);

                $fp = fopen($filePath, 'rb');
                fseek($fp, $info['offset']);
                $readSize = (int)(floor($info['size'] / $bytesPerFrame) * $bytesPerFrame);
                $pcmData = fread($fp, $readSize);
                fclose($fp);

                if (!$firstChar) {
                    $bytesPerSec = $sampleRate * $bytesPerFrame;
                    $silenceBytes = (int)($bytesPerSec * 0.18);
                    $silenceBytes = (int)(round($silenceBytes / $bytesPerFrame) * $bytesPerFrame);
                    $rawVoicePcm .= str_repeat("\x00", $silenceBytes);
                }

                $rawVoicePcm .= $pcmData;
                $firstChar = false;
            }
        }
    }

    $totalLengthBytes = strlen($rawVoicePcm);
    if ($totalLengthBytes === 0) {
        http_response_code(404);
        exit;
    }

    $bgNoisePcm = '';
    $noisePath = $getAudioPath('noise');

    if ($noisePath && ($noiseInfo = $parseWav($noisePath))) {
        $nFp = fopen($noisePath, 'rb');
        fseek($nFp, $noiseInfo['offset']);
        $nReadSize = (int)(floor($noiseInfo['size'] / ($numChannels * ($bitsPerSample / 8))) * ($numChannels * ($bitsPerSample / 8)));
        $baseNoiseData = fread($nFp, $nReadSize);
        fclose($nFp);

        while (strlen($bgNoisePcm) < $totalLengthBytes) {
            $bgNoisePcm .= $baseNoiseData;
        }
        $bgNoisePcm = substr($bgNoisePcm, 0, $totalLengthBytes);
    } else {
        $totalSamples = (int)($totalLengthBytes / 2);
        $noiseSamples = [];
        for ($i = 0; $i < $totalSamples; $i++) {
            $noiseSamples[] = pack('v', rand(-500, 500));
        }
        $bgNoisePcm = implode('', $noiseSamples);
    }

    $finalPcm = '';
    $numSamples = (int)($totalLengthBytes / 2);

    $voiceSamples = unpack('s*', $rawVoicePcm);
    $noiseSamples = unpack('s*', $bgNoisePcm);

    for ($i = 1; $i <= $numSamples; $i++) {
        $v = $voiceSamples[$i] ?? 0;
        $n = (int)(($noiseSamples[$i] ?? 0) * 0.25); 

        $mixed = $v + $n;

        if ($mixed > 32767)  $mixed = 32767;
        if ($mixed < -32768) $mixed = -32768;

        $finalPcm .= pack('v', $mixed);
    }

    $dataLength = strlen($finalPcm);
    $blockAlign = $numChannels * ($bitsPerSample / 8);
    $byteRate   = $sampleRate * $blockAlign;

    $header  = "RIFF";
    $header .= pack('V', 36 + $dataLength);
    $header .= "WAVEfmt ";
    $header .= pack('V', 16);             
    $header .= pack('v', 1);              
    $header .= pack('v', $numChannels);   
    $header .= pack('V', $sampleRate);    
    $header .= pack('V', $byteRate);      
    $header .= pack('v', $blockAlign);    
    $header .= pack('v', $bitsPerSample); 
    $header .= "data";
    $header .= pack('V', $dataLength);

    header('Content-Type: audio/wav');
    header('Content-Length: ' . (44 + $dataLength));
    header('Cache-Control: no-cache, no-store, must-revalidate');

    echo $header . $finalPcm;
    exit;
}


// ============================================================================
// 3. ENDPOINT C: ALTCHA Silent Challenge Generator PoW
// ============================================================================
if (isset($_GET['action']) && $_GET['action'] === 'captcha_pow') {
    header('Content-Type: application/json');
    
    $algorithm = 'SHA-256';
    $maxNumber = ALTCHA_MAX_NUMBER;
    
    $salt = bin2hex(random_bytes(12));
    $secretNumber = rand(1, $maxNumber);

    $challenge = hash('sha256', $salt . $secretNumber);
    $signature = hash_hmac('sha256', $challenge . $salt, ALTCHA_HMAC_KEY);

    echo json_encode([
        'algorithm' => $algorithm,
        'challenge' => $challenge,
        'salt'      => $salt,
        'signature' => $signature,
        'maxnumber' => $maxNumber
    ]);
    exit;
}

// ============================================================================
// 4. BACKEND POST VERIFICATION
// ============================================================================
$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name           = trim($_POST['name'] ?? '');
    $altchaPayload  = $_POST['altcha'] ?? '';
    $userImgCode    = strtoupper(trim($_POST['captcha_code'] ?? ''));
    $sessionImgCode = $_SESSION['captcha_code'] ?? '';

    // 1. Verify ALTCHA PoW + Replay Protection
    $isAltchaValid = false;
    if (!empty($altchaPayload)) {
        $decoded = json_decode(base64_decode($altchaPayload), true);
        if ($decoded && is_array($decoded)) {
            $salt = $decoded['salt'] ?? '';
            $signature = $decoded['signature'] ?? '';

            if (!isset($_SESSION['used_altcha_salts'])) {
                $_SESSION['used_altcha_salts'] = [];
            }

            if (!in_array($salt, $_SESSION['used_altcha_salts'], true)) {
                $expectedSig = hash_hmac('sha256', ($decoded['challenge'] ?? '') . $salt, ALTCHA_HMAC_KEY);
                $expectedChal = hash('sha256', $salt . ($decoded['number'] ?? 0));

                if (hash_equals($expectedSig, $signature) && 
                    hash_equals($expectedChal, $decoded['challenge'] ?? '')) {
                    $isAltchaValid = true;
                    $_SESSION['used_altcha_salts'][] = $salt;
                }
            }
        }
    }

    // 2. Verify Visual CAPTCHA (Only required if failed >= 5 times)
    $isImageValid = true;
    if ($requiresCaptcha) {
        
		// Check if user submitted a code, a session code exists, and they match
		if (empty($userImgCode) || empty($sessionImgCode)) {
    		$isImageValid = false;
		} else if ($userImgCode === $sessionImgCode) {
    		$isImageValid = true;
		} else {
    		$isImageValid = false;
		}

    }

    unset($_SESSION['captcha_code']);

    // 3. Verify Business Logic (Only "john" or "John" is valid)
    $isNameValid = (strtolower($name) === 'john');

    if ($isAltchaValid && $isImageValid && $isNameValid) {
        $_SESSION['failed_attempts'] = 0; // Reset counter on success
        $requiresCaptcha = false;
        $nameDisplay = htmlspecialchars($name);
        $message = "<strong>Success!</strong> Welcome, {$nameDisplay}. All verification checks passed.";
        $messageType = "success";
    } else {
        $_SESSION['failed_attempts']++; // Increment failure count
        $requiresCaptcha = ($_SESSION['failed_attempts'] >= MAX_REGISTER_FAILS);

        if (!$isAltchaValid) {
            $message = "<strong>Security Check Failed!</strong> Proof-of-Work failed.";
        } elseif (!$isNameValid) {
            $message = "<strong>Registration Failed!</strong> Only 'John' is permitted to register. Failures: {$_SESSION['failed_attempts']}/" . MAX_REGISTER_FAILS;
        } elseif (!$isImageValid) {
            $message = "<strong>Invalid CAPTCHA!</strong> Code did not match.";
        }
        $messageType = "error";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALTCHA + Securimage Audio Demo</title>
	<!--Remix icons from www.jsdelivr.com-->
	<link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.min.css" rel="stylesheet">
	
    <script defer type="module" src="altcha.min.js"></script>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #f3f4f6; padding: 40px 20px; }
        .card { max-width: 420px; margin: 0 auto; background: #fff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
        input[type="text"] { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; box-sizing: border-box; }
        button[type="submit"] { width: 100%; background: #2563eb; color: #fff; border: none; padding: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; }
        button[type="submit"]:disabled { background: #9ca3af; cursor: not-allowed; }
        
        .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .alert.success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .alert.error { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

        #pow-status { font-size: 13px; color: #6b7280; margin-bottom: 12px; }
        #image-challenge-box { display: none; background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px; }
        
        .captcha-img-wrap { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .captcha-img-wrap img { border-radius: 4px; border: 1px solid #d1d5db; }
        .icon-btn { background: #fff; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; cursor: pointer; font-size: 16px; }
        .icon-btn:hover { background: #f3f4f6; }
    </style>
</head>
<body>

<div class="card">
    <h2 style="margin-top:0;">Contact Form</h2>

    <?php if ($message): ?>
        <div class="alert <?= $messageType ?>">
            <?= $message ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="index.php">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your Name" required>
        </div>

        <!-- Silent ALTCHA PoW -->
        <altcha-widget challengeurl="index.php?action=captcha_pow" hide-checkbox auto="onload"></altcha-widget>

        <div id="pow-status">⏳ Running security check...</div>
        
        <br>

        <!-- Visual + Audio Challenge Box -->
        <div id="image-challenge-box">
            <label>Security Code Challenge</label>
            <div class="captcha-img-wrap">
                <img id="c_img" src="index.php?action=captcha_img" alt="CAPTCHA Image">
                

                
				<!-- Listen Audio Button -->
				<button type="button" class="icon-btn" onclick="playAudioCaptcha()" title="Listen to CAPTCHA">
    				<i class="ri-volume-up-line"></i>
				</button>
				
				<!-- Refresh CAPTCHA Button -->
				<button type="button" class="icon-btn" onclick="refreshCaptcha()" title="Refresh CAPTCHA">
    				<i id="refresh-icon" class="ri-refresh-line"></i>
				</button>
				


            </div>
            
            <!-- Hidden Audio Element -->
            <audio id="captcha_player" style="display:none;"></audio>

            <input type="text" name="captcha_code" id="captcha_code" placeholder="Enter characters above" maxlength="5" autocomplete="off">
        </div>

        <button type="submit" id="submit-btn" disabled>Submit Form</button>
    </form>
</div>

<script>
    const altchaWidget = document.querySelector('altcha-widget');
    const powStatus = document.getElementById('pow-status');
    const imageBox = document.getElementById('image-challenge-box');
    const submitBtn = document.getElementById('submit-btn');

    // Server-side state passed to JS
    const requiresCaptcha = <?= json_encode($requiresCaptcha) ?>;

    altchaWidget.addEventListener('statechange', (ev) => {
        if (ev.detail.state === 'verified') {
            powStatus.style.display = 'none';
            submitBtn.disabled = false;
            
            // Only unhide the CAPTCHA box and require input if retries >= MAX_REGISTER_FAILS
            if (requiresCaptcha) {
                imageBox.style.display = 'block';
                document.getElementById('captcha_code').required = true;
            }
        } else if (ev.detail.state === 'error') {
            powStatus.innerHTML = '<span style="color:red;">❌ Security check failed. Refresh page.</span>';
        }
    });

    function refreshCaptcha() {
        document.getElementById('c_img').src = 'index.php?action=captcha_img&refresh=1&r=' + Math.random();
        document.getElementById('captcha_code').value = '';
    }

    function playAudioCaptcha() {
        const player = document.getElementById('captcha_player');
        player.src = 'index.php?action=captcha_audio&r=' + Math.random();
        player.play();
    }
</script>

</body>
</html>
