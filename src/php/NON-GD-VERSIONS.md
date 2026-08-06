# CAPTCHA Generator - No GD Library Required

All versions work **without PHP GD library**. Choose based on your needs:

## 1. SVG Version (Recommended) 
**File:** `captcha-generator.php`
- ✅ Works in all modern browsers
- ✅ Best visual security
- ✅ Scalable (no pixelation)
- ✅ No dependencies

**Usage:**
```html
<img src="captcha-generator.php" alt="CAPTCHA">
```

**Test:**
```bash
curl http://localhost:8080/captcha-generator.php
```

---

## 2. Canvas Version (Interactive)
**File:** `captcha-generator-canvas.php`
- ✅ Client-side rendering (JavaScript Canvas)
- ✅ Click to refresh automatically
- ✅ Good security via client rendering
- ✅ No image files sent

**Usage:**
```html
<iframe src="captcha-generator-canvas.php" width="250" height="100" frameborder="0"></iframe>
```

**Features:**
- Click canvas to refresh
- Works in all modern browsers

---

## 3. Text JSON Version (Testing/API)
**File:** `captcha-generator-text.php`
- ✅ Returns JSON
- ✅ Good for CLI testing
- ✅ Accessibility friendly
- ✅ Mobile-friendly alternative

**Usage (API call):**
```javascript
const response = await fetch('captcha-generator-text.php');
const data = await response.json();
console.log(data.code); // Returns the CAPTCHA code
```

**Response:**
```json
{
  "code": "ABC123",
  "type": "text",
  "length": 6
}
```

---

## 4. ASCII Art Version (Fun/Terminal)
**File:** `captcha-generator-ascii.php`
- ✅ Plain text output
- ✅ Terminal-friendly
- ✅ Unique visual style
- ⚠️ Less secure than others

**Usage:**
```html
<pre><img src="captcha-generator-ascii.php" alt="CAPTCHA" style="font-family: monospace; font-size: 10px;"></pre>
```

**Test:**
```bash
curl http://localhost:8080/captcha-generator-ascii.php
```

---

## Comparison Table

| Feature | SVG | Canvas | Text | ASCII |
|---------|-----|--------|------|-------|
| Security | Excellent | Good | Basic | Low |
| Browser Support | All modern | All modern | All | Terminal |
| Rendering | Server | Client | N/A | Server |
| Image Size | Small | None | None | Small |
| Accessibility | Good | Fair | Excellent | Fair |
| Dependencies | None | None | None | None |
| Performance | Fast | Very Fast | Instant | Fast |

---

## Integration with form-example.html

**SVG Version (default):**
```html
<img src="/php/captcha-generator.php" alt="CAPTCHA" class="captcha-image" id="captchaImage">
```

**Canvas Version:**
```html
<iframe src="/php/captcha-generator-canvas.php" id="captchaFrame" width="250" height="100" frameborder="0"></iframe>
```

**Text Version (for testing):**
```javascript
async function loadCaptcha() {
    const response = await fetch('/php/captcha-generator-text.php');
    const data = await response.json();
    console.log('CAPTCHA code:', data.code);
}
```

---

## Verification Still Works the Same

All versions use the same `captcha-verify.php`:

```php
require_once 'captcha-verify.php';
$result = CaptchaVerifier::verify($_POST['captcha']);
if ($result['valid']) {
    echo 'Success!';
}
```

Session storage is identical across all generators.

---

## Requirements

✅ **Zero external dependencies**
✅ **No image libraries needed**
✅ **No special fonts required**
✅ **Works on any PHP server**
✅ **Works without any PHP extensions**

---

## Quick Start

1. **Use SVG version** (default):
   ```bash
   curl http://localhost:8080/captcha-generator.php
   ```

2. **Update form to use proxy**:
   ```bash
   ng serve  # Uses proxy.conf.json
   ```

3. **Test verification**:
   ```bash
   curl -X POST http://localhost:8080/captcha-verify.php -d "captcha=ABC123"
   ```

All done! No GD library required! 🎉
