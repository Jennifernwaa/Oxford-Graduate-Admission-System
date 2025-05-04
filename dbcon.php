<?php

require __DIR__.'/vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;


    $factory = (new Factory)
    ->withServiceAccount(__DIR__.'/oxford-graduate-admission-firebase-adminsdk-fbsvc-b13bd3293d.json') // Ensure the path is correct
    ->withDatabaseUri('https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app/'); // Verify the URI
    
    $database = $factory->createDatabase();

// Function to safely store session data after Firebase Auth login
function storeUserSession($uid, $email) {
    $_SESSION['user_id'] = $uid;
    $_SESSION['email'] = $email;
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();
}


?>
