<?php
/**
 * CAPTCHA Verification
 * Verifies submitted CAPTCHA against session stored value
 * 
 * Usage:
 * $result = verifyCaptcha($_POST['captcha']);
 * if ($result['valid']) {
 *     // CAPTCHA is correct
 * } else {
 *     // CAPTCHA is incorrect
 *     echo $result['message'];
 * }
 */

// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

class CaptchaVerifier {
    const CAPTCHA_EXPIRY = 600; // 10 minutes in seconds
    const MAX_ATTEMPTS = 5;
    const ATTEMPT_WINDOW = 3600; // 1 hour
    
    /**
     * Verify submitted CAPTCHA
     * 
     * @param string $submittedCaptcha User submitted CAPTCHA code
     * @return array Array with 'valid' (bool) and 'message' (string)
     */
    public static function verify($submittedCaptcha) {
        // Trim and convert to uppercase
        $submittedCaptcha = trim(strtoupper($submittedCaptcha));
        
        // Check if CAPTCHA exists in session
        if (!isset($_SESSION['captcha_code'])) {
            return [
                'valid' => false,
                'message' => 'CAPTCHA non trovato. Per favore aggiorna la pagina.'
            ];
        }
        
        // Check if CAPTCHA has expired
        if (isset($_SESSION['captcha_time'])) {
            if (time() - $_SESSION['captcha_time'] > self::CAPTCHA_EXPIRY) {
                unset($_SESSION['captcha_code']);
                unset($_SESSION['captcha_time']);
                return [
                    'valid' => false,
                    'message' => 'CAPTCHA scaduto. Per favore aggiorna e riprova.'
                ];
            }
        }
        
        // Check rate limiting (prevent brute force)
        if (!isset($_SESSION['captcha_attempts'])) {
            $_SESSION['captcha_attempts'] = [];
        }
        
        $currentTime = time();
        $_SESSION['captcha_attempts'] = array_filter(
            $_SESSION['captcha_attempts'],
            function($timestamp) use ($currentTime) {
                return $currentTime - $timestamp < self::ATTEMPT_WINDOW;
            }
        );
        
        if (count($_SESSION['captcha_attempts']) >= self::MAX_ATTEMPTS) {
            return [
                'valid' => false,
                'message' => 'Troppi tentativi. Per favore riprova più tardi.'
            ];
        }
        
        // Record this attempt
        $_SESSION['captcha_attempts'][] = $currentTime;
        
        // Verify CAPTCHA
        if ($submittedCaptcha === $_SESSION['captcha_code']) {
            // Clear CAPTCHA on successful verification
            unset($_SESSION['captcha_code']);
            unset($_SESSION['captcha_time']);
            $_SESSION['captcha_attempts'] = [];
            
            return [
                'valid' => true,
                'message' => 'CAPTCHA verificato con successo.'
            ];
        } else {
            return [
                'valid' => false,
                'message' => 'Verifica CAPTCHA fallita. Per favore riprova.'
            ];
        }
    }
    
    /**
     * Clear CAPTCHA from session (useful for cleanup)
     */
    public static function clear() {
        unset($_SESSION['captcha_code']);
        unset($_SESSION['captcha_time']);
        unset($_SESSION['captcha_attempts']);
    }
}

// If this script is called directly with POST data, verify and return JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST' && basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    $captcha = $_POST['captcha'] ?? '';
    $result = CaptchaVerifier::verify($captcha);
    
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}

// Otherwise, make the class available for inclusion
// Usage: require_once 'captcha-verify.php';
//        $result = CaptchaVerifier::verify($_POST['captcha']);
?>
