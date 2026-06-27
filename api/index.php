<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Inject Vercel environment variables directly into PHP process to ensure they are loaded
$_ENV['APP_ENV'] = 'production';
$_ENV['APP_DEBUG'] = 'true';
$_ENV['LOG_CHANNEL'] = 'stderr';
$_ENV['CACHE_DRIVER'] = 'array';
$_ENV['SESSION_DRIVER'] = 'cookie';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp';
$_ENV['DB_CONNECTION'] = 'sqlite';
$_ENV['DB_DATABASE'] = '/tmp/database.sqlite';
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/packages.php';
$_ENV['APP_SERVICES_CACHE'] = '/tmp/services.php';
$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_ENV['APP_ROUTES_CACHE'] = '/tmp/routes.php';
$_ENV['APP_EVENTS_CACHE'] = '/tmp/events.php';

putenv('APP_ENV=production');
putenv('APP_DEBUG=true');
putenv('LOG_CHANNEL=stderr');
putenv('CACHE_DRIVER=array');
putenv('SESSION_DRIVER=cookie');
putenv('VIEW_COMPILED_PATH=/tmp');
putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE=/tmp/database.sqlite');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');
putenv('APP_EVENTS_CACHE=/tmp/events.php');

// Suppress deprecation warnings to keep output clean
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

try {
    // Copy SQLite database to /tmp so it's writeable at runtime
    $templateDb = __DIR__ . '/../database/database.sqlite';
    $targetDb = '/tmp/database.sqlite';
    if (!file_exists($targetDb) && file_exists($templateDb)) {
        copy($templateDb, $targetDb);
        chmod($targetDb, 0666);
    }

    // Register the Composer autoloader...
    require __DIR__.'/../vendor/autoload.php';

    // Bootstrap Laravel
    /** @var Application $app */
    $app = require_once __DIR__.'/../bootstrap/app.php';

    // Handle the request
    $app->handleRequest(Request::capture());

} catch (\Throwable $e) {
    header("HTTP/1.1 200 OK");
    header("Content-Type: text/html; charset=utf-8");
    echo "<h1>Real Exception Caught in api/index.php</h1>";
    echo "<h2>Class: " . get_class($e) . "</h2>";
    echo "<p>Message: <strong>" . htmlspecialchars($e->getMessage()) . "</strong></p>";
    echo "<p>File: " . $e->getFile() . ":" . $e->getLine() . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    exit(0);
}
