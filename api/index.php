<?php

// Enable error reporting and display errors to capture boot crashes
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        echo "<h1>Fatal Error Caught</h1>";
        echo "<pre>";
        print_r($error);
        echo "</pre>";
    }
});

set_exception_handler(function ($exception) {
    echo "<h1>Uncaught Exception</h1>";
    echo "<pre>";
    echo $exception;
    echo "</pre>";
});

// Copy SQLite database to /tmp so it's writeable at runtime
$templateDb = __DIR__ . '/../database/database.sqlite';
$targetDb = '/tmp/database.sqlite';
if (!file_exists($targetDb) && file_exists($templateDb)) {
    copy($templateDb, $targetDb);
    chmod($targetDb, 0666);
}

try {
    // Forward Vercel requests to Laravel's public/index.php
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    header("HTTP/1.1 200 OK");
    echo "<h1>Caught Boot Throwable</h1>";
    $curr = $e;
    while ($curr) {
        echo "<h2>Exception Class: " . get_class($curr) . "</h2>";
        echo "<p>Message: <strong>" . htmlspecialchars($curr->getMessage()) . "</strong></p>";
        echo "<p>File: " . $curr->getFile() . ":" . $curr->getLine() . "</p>";
        echo "<pre>" . htmlspecialchars($curr->getTraceAsString()) . "</pre>";
        echo "<hr>";
        $curr = $curr->getPrevious();
    }
    exit(0);
}
