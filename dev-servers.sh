#!/bin/bash

# Start PHP and Angular dev servers in parallel

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PHP_DIR="$PROJECT_DIR/src/php"
PHP_PORT=8080
ANGULAR_PORT=4200

echo "🚀 Starting development servers..."
echo ""
echo "📱 Angular Dev Server: http://localhost:$ANGULAR_PORT"
echo "🐘 PHP Server: http://localhost:$PHP_PORT"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $PHP_PID 2>/dev/null
    kill $ANGULAR_PID 2>/dev/null
    wait $PHP_PID 2>/dev/null
    wait $ANGULAR_PID 2>/dev/null
    echo "✓ All servers stopped"
    exit 0
}

startPhp() {
	# Start PHP server
	echo "Starting PHP server on port $PHP_PORT...from $PHP_DIR"
	cd "$PHP_DIR"
	php -S localhost:$PHP_PORT > /tmp/php-server.log 2>&1 &
	PHP_PID=$!
	echo "✓ PHP Server PID: $PHP_PID"

	sleep 1
}

# email: info/info_test
# Username:info@emanuele.root.sx
# Password:info_test
# POP/IMAP Server:mail.emanuele.root.sx
# SMTP Server:mail.emanuele.root.sx port 587

# Username:	info@emanuele.root.sx
# Password:	kScDRYWXSJk!
# POP/IMAP Server:	mail.emanuele.root.sx
# SMTP Server:	mail.emanuele.root.sx port 587

startAngular() {
	# Start Angular dev server
	echo "Starting Angular dev server on port $ANGULAR_PORT..."
	cd "$PROJECT_DIR"
	if command -v ng &> /dev/null; then
	    npm start > /tmp/angular-server.log 2>&1 &
	elif command -v npx &> /dev/null; then
	    npx ng serve --port $ANGULAR_PORT > /tmp/angular-server.log 2>&1 &
	else
	    echo "❌ ng command not found. Install Angular CLI:"
	    echo "   npm install -g @angular/cli"
	    kill $PHP_PID
	    exit 1
	fi

	ANGULAR_PID=$!
	echo "✓ Angular Server PID: $ANGULAR_PID"
}


trap cleanup EXIT INT TERM

startPhp

startAngular

sleep 2

echo ""
echo "✅ Servers started!"
echo ""
echo "Logs:"
echo "  PHP:     tail -f /tmp/php-server.log"
echo "  Angular: tail -f /tmp/angular-server.log"
echo ""
echo "Open browser:"
echo "  http://localhost:$ANGULAR_PORT"
echo ""

# Keep script running
wait
