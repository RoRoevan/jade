<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Contracts\Debug\ExceptionHandler;

define('LARAVEL_START', microtime(true));

// Suppress deprecation warnings to keep output clean
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

class DiagnosticExceptionHandler implements ExceptionHandler {
    public function report(\Throwable $e) {}
    public function shouldReport(\Throwable $e) { return false; }
    public function render($request, \Throwable $e) {
        header("HTTP/1.1 200 OK");
        echo "<h1>Real Original Exception Caught in Handler</h1>";
        echo "<h2>Class: " . get_class($e) . "</h2>";
        echo "<p>Message: <strong>" . htmlspecialchars($e->getMessage()) . "</strong></p>";
        echo "<p>File: " . $e->getFile() . ":" . $e->getLine() . "</p>";
        echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
        exit(0);
    }
    public function renderForConsole($output, \Throwable $e) {}
}

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

    // Swap ExceptionHandler with our diagnostic handler to capture the real boot error
    $app->singleton(
        ExceptionHandler::class,
        DiagnosticExceptionHandler::class
    );

    // Handle the request
    $app->handleRequest(Request::capture());

} catch (\Throwable $e) {
    header("HTTP/1.1 200 OK");
    echo "<h1>Unhandled Exception in api/index.php global try-catch</h1>";
    echo "<h2>Class: " . get_class($e) . "</h2>";
    echo "<p>Message: <strong>" . htmlspecialchars($e->getMessage()) . "</strong></p>";
    echo "<p>File: " . $e->getFile() . ":" . $e->getLine() . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    exit(0);
}
