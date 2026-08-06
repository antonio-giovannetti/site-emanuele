<?php

/**
 * Form Handler - CAPTCHA Verification + Email Sending + Logging
 * 
 * Verifies submitted CAPTCHA and sends form data via email
 * Logs all events to server console (visible in terminal running PHP server)
 * 
 * POST Parameters:
 *   - name: Submitter name (required)
 *   - email: Submitter email (required)
 *   - phone: Submitter phone (optional)
 *   - message: Form message (required)
 *   - captcha: CAPTCHA code (required)
 */

// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'captcha-verify.php';

header('Content-Type: application/json');

class FormHandler {
    
    private $recipientEmail = 'info@example.com';
    private $senderEmail = 'info@psicoterapeutaceci.eu';
    private $envelopeFrom = 'info@psicoterapeutaceci.eu';
    private $senderName = 'Contact Form';
    
    public function __construct($recipientEmail = null) {
        $this->senderEmail = getenv('MAIL_FROM_EMAIL') ?: (getenv('SMTP_FROM_EMAIL') ?: $this->senderEmail);
        $this->envelopeFrom = getenv('MAIL_ENVELOPE_FROM') ?: $this->senderEmail;
        $this->senderName = getenv('MAIL_FROM_NAME') ?: (getenv('SMTP_FROM_NAME') ?: $this->senderName);

        if ($recipientEmail) {
            $this->recipientEmail = $recipientEmail;
        }
    }
    
    /**
     * Process form submission
     */
    public function processForm($data) {
        // Verify request method
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Invalid request method', 405);
        }
        
        // Verify CAPTCHA
        $captchaResult = CaptchaVerifier::verify($data['captcha'] ?? '');
        if (!$captchaResult['valid']) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => $captchaResult['message'],
                'type' => 'captcha'
            ];
        }
        
        // Validate form data
        $validation = $this->validateData($data);
        if (!$validation['valid']) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => $validation['message'],
                'type' => 'validation'
            ];
        }
        
        // Sanitize data
        $sanitized = $this->sanitizeData($data);
        
        // Send email
        $emailResult = $this->sendEmail($sanitized);
        if (!$emailResult['success']) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Invio fallito, si prega di riprovare.',
                'type' => 'email'
            ];
        }
        
        // Log submission to file
        $this->logSubmission($sanitized);
        
        return [
            'success' => true,
            'message' => 'Modulo inviato con successo! Ti contatteremo presto.',
            'type' => 'success'
        ];
    }
    
    /**
     * Validate form data
     */
    private function validateData($data) {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $message = trim($data['message'] ?? '');
        
        if (empty($name)) {
            return ['valid' => false, 'message' => 'Nome richiesto'];
        }
        if (empty($email)) {
            return ['valid' => false, 'message' => 'Email richiesta'];
        }
        if (empty($message)) {
            return ['valid' => false, 'message' => 'Messaggio richiesto'];
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['valid' => false, 'message' => 'Indirizzo email non valido'];
        }
        
        if (strlen($name) < 3 || strlen($name) > 100) {
            return ['valid' => false, 'message' => 'Il nome deve essere di 3-100 caratteri'];
        }
        
        if (strlen($message) < 10 || strlen($message) > 5000) {
            return ['valid' => false, 'message' => 'Il messaggio deve essere di 10-5000 caratteri'];
        }
        
        if (!empty($phone)) {
            if (strlen($phone) < 5 || strlen($phone) > 20) {
                return ['valid' => false, 'message' => 'Formato del telefono non valido'];
            }
        }
        
        return ['valid' => true];
    }
    
    /**
     * Sanitize form data
     */
    private function sanitizeData($data) {
        return [
            'name' => htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'email' => filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL),
            'phone' => htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'message' => htmlspecialchars(trim($data['message'] ?? ''), ENT_QUOTES, 'UTF-8'),
            'submissionDate' => date('Y-m-d H:i:s'),
            'ipAddress' => $this->getClientIP()
        ];
    }
    
    /**
     * Send email with form data
     */
    private function sendEmail($data) {
        $subject = "New Contact Form Submission from {$data['name']}";
        $body = $this->buildEmailBody($data);

        $adminSent = $this->sendNativeEmail($this->recipientEmail, $subject, $body, $data['email']);
        if (!$adminSent) {
            return ['success' => false];
        }

        if (!$this->sendConfirmationEmail($data)) {
            return ['success' => false];
        }

        return ['success' => true];
    }
    
    /**
     * Build email body
     */
    private function buildEmailBody($data) {
        $body = "=== NUOVA RICHIESTA DI CONTATTO ===\n\n";
        $body .= "Nome: {$data['name']}\n";
        $body .= "Email: {$data['email']}\n";
        
        if (!empty($data['phone'])) {
            $body .= "Telefono: {$data['phone']}\n";
        }
        
        $body .= "\n--- Messaggio ---\n";
        $body .= "{$data['message']}\n";
        $body .= "\n--- Metadata ---\n";
        $body .= "Submitted: {$data['submissionDate']}\n";
        $body .= "IP Address: {$data['ipAddress']}\n";
        $body .= "User Agent: {$_SERVER['HTTP_USER_AGENT']}\n";
        $body .= "\n=== END OF SUBMISSION ===\n";
        
        return $body;
    }
    
    /**
     * Send confirmation email to user
     */
    private function sendConfirmationEmail($data) {
        $subject = "Abbiamo ricevuto il tuo messaggio";
        
        $body = "Caro {$data['name']},\n\n";
        $body .= "Grazie per averci contattato. Abbiamo ricevuto il tuo messaggio e ti risponderemo entro 24 ore.\n\n";
        $body .= "Dettagli della tua richiesta:\n";
        $body .= "- Inviato: {$data['submissionDate']}\n";
        $body .= "- Email: {$data['email']}\n";
        
        if (!empty($data['phone'])) {
            $body .= "- Telefono: {$data['phone']}\n";
        }
        
        $body .= "\nCordiali saluti,\n";
        $body .= "Supporto Contatti\n";
        
        return $this->sendNativeEmail($data['email'], $subject, $body);
    }

    /**
     * Send plain text email using PHP native mail()
     */
    private function sendNativeEmail($to, $subject, $body, $replyToEmail = null) {
        if (!filter_var($this->senderEmail, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        if (!filter_var($this->envelopeFrom, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $safeSenderName = str_replace(['"', "\r", "\n"], '', $this->senderName);
        $headers = [
            "From: {$safeSenderName} <{$this->senderEmail}>",
            "Return-Path: {$this->envelopeFrom}",
            "MIME-Version: 1.0",
            "Content-Type: text/plain; charset=UTF-8",
            "Content-Transfer-Encoding: 8bit"
        ];

        if (!empty($replyToEmail) && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $headers[] = "Reply-To: {$replyToEmail}";
        }

        $encodedSubject = function_exists('mb_encode_mimeheader')
            ? mb_encode_mimeheader($subject, 'UTF-8')
            : $subject;

        $additionalParams = '-f' . escapeshellarg($this->envelopeFrom);
        return mail($to, $encodedSubject, $body, implode("\r\n", $headers), $additionalParams);
    }
    
    /**
     * Log submission to file
     */
    private function logSubmission($data) {
        $logFile = __DIR__ . '/logs/submissions.log';
        $logDir = dirname($logFile);
        
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0755, true);
        }
        
        $logEntry = json_encode([
            'timestamp' => $data['submissionDate'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'ip' => $data['ipAddress'],
            'status' => 'submitted'
        ]) . "\n";
        
        @file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Get client IP address
     */
    private function getClientIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
        
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
    }
    
    /**
     * Error response
     */
    private function error($message, $code = 500) {
        http_response_code($code);
        return [
            'success' => false,
            'message' => $message,
            'type' => 'error'
        ];
    }
}

// Main execution
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $recipientEmail = getenv('CONTACT_FORM_EMAIL') ?: 'antonio_giovannetti@libero.it';
        $handler = new FormHandler($recipientEmail);
        $response = $handler->processForm($_POST);

        echo json_encode($response);
        exit;
    } else {
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
    exit;
}
?>
