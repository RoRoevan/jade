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

foreach ($_ENV as $key => $val) {
    putenv("{$key}={$val}");
}

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
    // If a fatal exception occurs during bootstrap, return a clean maintenance response
    header("HTTP/1.1 503 Service Unavailable");
    header("Content-Type: text/html; charset=utf-8");
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Under Maintenance | Jade</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Outfit', sans-serif;
                background: radial-gradient(circle at center, #064e3b 0%, #022c22 100%);
                color: #f0fdf4;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 2rem;
            }
            .container {
                max-width: 560px;
                text-align: center;
                background: rgba(6, 78, 59, 0.4);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(245, 158, 11, 0.15);
                padding: 3.5rem 2.5rem;
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            }
            h1 {
                font-size: 2.2rem;
                margin-top: 1rem;
                color: #ffffff;
            }
            p {
                font-size: 1.1rem;
                color: #a7f3d0;
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <span style="font-size: 3rem;">🌱</span>
            <h1>Undergoing Maintenance</h1>
            <p>Sorry, we are undergoing maintenance right now. We are currently updating our systems. Please check back shortly!</p>
        </div>
    </body>
    </html>
    <?php
    exit(0);
}
