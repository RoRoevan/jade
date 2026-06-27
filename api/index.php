<?php

// Suppress deprecation warnings on PHP 8.5+ to prevent HTML output corruption
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

// Copy SQLite database to /tmp so it's writeable at runtime
$templateDb = __DIR__ . '/../database/database.sqlite';
$targetDb = '/tmp/database.sqlite';
if (!file_exists($targetDb) && file_exists($templateDb)) {
    copy($templateDb, $targetDb);
    chmod($targetDb, 0666);
}

// Forward Vercel requests to Laravel's public/index.php
require __DIR__ . '/../public/index.php';
