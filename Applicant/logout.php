<?php
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Redirect to the login page
header('Location: login.html'); // Or wherever your login page is
exit();
?>