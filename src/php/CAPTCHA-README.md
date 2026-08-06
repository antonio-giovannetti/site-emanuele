# PHP CAPTCHA System

A secure, lightweight CAPTCHA system for protecting forms from bot submissions.

## Features

✅ **Image-based CAPTCHA** - Randomly generated text images
✅ **Session-based Storage** - Secure server-side verification
✅ **Rate Limiting** - Prevents brute force attempts (max 5 attempts/hour)
✅ **Expiration** - CAPTCHA expires after 10 minutes
✅ **No Dependencies** - Pure PHP with GD library (built-in)
✅ **Responsive Design** - Mobile-friendly example form
✅ **AJAX Support** - Async verification without page reload

## Files Included

### 1. `captcha-generator.php`
Generates a random CAPTCHA image and stores the answer in the session.

**Usage:**
```html
<img src="captcha-generator.php" alt="CAPTCHA">
```

**Features:**
- Generates 6-character random alphanumeric codes
- Excludes ambiguous characters (I, O, L, 1, 0)
- Adds noise and distortion for security
- Caches headers to prevent browser caching

### 2. `captcha-verify.php`
Verifies submitted CAPTCHA against the session value.

**Usage in PHP:**
```php
<?php
require_once 'captcha-verify.php';

$result = CaptchaVerifier::verify($_POST['captcha']);

if ($result['valid']) {
    // Process form
    echo "Form accepted!";
} else {
    // Reject form
    echo "Error: " . $result['message'];
}
?>
```

**Usage with AJAX:**
```javascript
const formData = new FormData(form);
const response = await fetch('captcha-verify.php', {
    method: 'POST',
    body: formData
});
const result = await response.json();
if (result.valid) {
    // Process submission
}
```

**Security Features:**
- 10-minute expiration
- Maximum 5 attempts per hour (rate limiting)
- Automatic cleanup after successful verification
- Prevents brute force attacks

### 3. `form-example.html`
Complete working example with:
- Responsive contact form
- Real-time CAPTCHA refresh
- AJAX form submission
- Error/success messages
- Loading states

## Setup Instructions

### Prerequisites
- PHP 7.0+
- GD Library enabled (usually enabled by default)
- Sessions enabled

### Step 1: Verify GD Library
```bash
php -r "echo extension_loaded('gd') ? 'GD enabled' : 'GD not found';"
```

### Step 2: Create Backend Handler
Create `form-handler.php` to process form submissions:

```php
<?php
session_start();
require_once 'captcha-verify.php';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CAPTCHA
    $captchaResult = CaptchaVerifier::verify($_POST['captcha'] ?? '');
    
    if (!$captchaResult['valid']) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => $captchaResult['message']]);
        exit;
    }
    
    // Extract form data
    $name = htmlspecialchars($_POST['name'] ?? '');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST['message'] ?? '');
    
    // Validate data
    if (!$name || !$email || !$message) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['valid' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Process the form (send email, save to database, etc.)
    // Example: send email
    $to = 'admin@example.com';
    $subject = "New contact form submission from $name";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['valid' => true, 'message' => 'Form submitted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['valid' => false, 'message' => 'Failed to send form']);
    }
    exit;
}
?>
```

### Step 3: Update HTML Form
Modify `form-example.html` to submit to your handler:

```javascript
// In the form submit handler, add:
if (captchaResult.valid) {
    // Submit form to backend
    const formResponse = await fetch('form-handler.php', {
        method: 'POST',
        body: formData
    });
    
    const formResult = await formResponse.json();
    showMessage(formResult.message, formResult.valid ? 'success' : 'error');
}
```

## Configuration

### CAPTCHA Length
Edit `captcha-generator.php`:
```php
define('CAPTCHA_LENGTH', 6); // Change to desired length
```

### Image Dimensions
```php
define('CAPTCHA_WIDTH', 250);  // Width in pixels
define('CAPTCHA_HEIGHT', 80);  // Height in pixels
```

### Expiration Time
Edit `captcha-verify.php`:
```php
const CAPTCHA_EXPIRY = 600; // 10 minutes in seconds
```

### Rate Limiting
```php
const MAX_ATTEMPTS = 5;           // Max attempts
const ATTEMPT_WINDOW = 3600;      // Per 1 hour
```

## Security Best Practices

1. **Always validate server-side** - Never trust client-side validation alone
2. **Use HTTPS** - Protect data in transit
3. **Sanitize input** - Use `htmlspecialchars()` and `filter_var()`
4. **Log attempts** - Track failed CAPTCHA attempts for monitoring
5. **Combine with other measures**:
   - Email verification
   - reCAPTCHA v3 for added security
   - Rate limiting on the handler endpoint
   - CSRF tokens

## Troubleshooting

### "CAPTCHA not found" error
- Ensure sessions are enabled in `php.ini`
- Check `session.save_path` is writable

### Blank CAPTCHA image
- Verify GD library is installed: `php -r "phpinfo();" | grep -i gd`
- Check PHP error logs: `tail -f /var/log/php-errors.log`

### CAPTCHA verification failing
- Ensure session data isn't being cleared between requests
- Check for multiple session starts in your code
- Verify `session.cookie_httponly` settings if using HTTPS

### Image distortion issues
- GD library doesn't support TrueType fonts by default
- Script falls back to built-in fonts (less distortion)
- To use custom fonts, place `arial.ttf` in the same directory

## Testing

### Manual Testing
1. Open `form-example.html` in a browser
2. Enter form data
3. Submit with correct CAPTCHA code
4. Submit with incorrect code (should show error)
5. Click refresh 6 times quickly (should show rate limit message)

### Unit Test Example
```php
<?php
session_start();
require_once 'captcha-verify.php';

// Test 1: Successful verification
$_SESSION['captcha_code'] = 'TESTCODE';
$_SESSION['captcha_time'] = time();
$_SESSION['captcha_attempts'] = [];

$result = CaptchaVerifier::verify('TESTCODE');
assert($result['valid'] === true, 'Test 1 failed');
assert(!isset($_SESSION['captcha_code']), 'Test 1 cleanup failed');

echo "✓ All tests passed";
?>
```

## API Reference

### CaptchaVerifier::verify($submittedCode)
Verifies a submitted CAPTCHA code.

**Parameters:**
- `$submittedCode` (string) - The code submitted by the user

**Returns:**
```php
[
    'valid' => bool,      // true if correct, false otherwise
    'message' => string   // Status message
]
```

### CaptchaVerifier::clear()
Manually clear CAPTCHA session data.

```php
CaptchaVerifier::clear();
```

## License
Free to use and modify. Attribution appreciated but not required.

## Support
For issues or questions, refer to the inline code documentation.
