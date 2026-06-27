<?php
$path = __DIR__.'/../vendor/autoload.php';
if (file_exists($path)) {
    echo "vendor/autoload.php EXISTS!\n";
} else {
    echo "vendor/autoload.php does NOT exist!\n";
}
