<?php

// Copy SQLite database to /tmp so it's writeable at runtime
$templateDb = __DIR__ . '/../database/database.sqlite';
$targetDb = '/tmp/database.sqlite';
if (!file_exists($targetDb) && file_exists($templateDb)) {
    copy($templateDb, $targetDb);
    chmod($targetDb, 0666);
}

// Forward Vercel requests to Laravel's public/index.php
require __DIR__ . '/../public/index.php';
