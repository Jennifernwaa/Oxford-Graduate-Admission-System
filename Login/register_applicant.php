<?php
// Firebase credentials
$firebaseConfig = [
    'apiKey' => 'AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU',
    'authDomain' => 'oxford-graduate-admission.firebaseapp.com',
    'projectId' => 'oxford-graduate-admission',
    'databaseURL' => 'https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app/',
    'appId' => '1:992593803011:web:4c853113afb814b9c7db36'
];

// Set response headers for CORS and JSON response
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get user input
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Basic validation
if (empty($email) || empty($password)) {
    echo json_encode(['error' => 'Please enter email and password.']);
    exit;
}

try {
    // Firebase Auth REST API endpoint
    $authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' . $firebaseConfig['apiKey'];
    
    // Create user in Firebase Auth
    $authResponse = file_get_contents($authUrl, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode([ 'email' => $email, 'password' => $password, 'returnSecureToken' => true ])
        ]
    ]));
    
    $authData = json_decode($authResponse, true);
    if (isset($authData['error'])) {
        echo json_encode(['error' => $authData['error']['message']]);
        exit;
    }

    // Save user data to Firebase Realtime Database
    $uid = $authData['localId'];
    $dbUrl = $firebaseConfig['databaseURL'] . 'users/' . $uid . '.json';
    
    $dbResponse = file_get_contents($dbUrl, false, stream_context_create([
        'http' => [
            'method' => 'PUT',
            'header' => 'Content-Type: application/json',
            'content' => json_encode([ 'username' => $email, 'role' => 'Applicant' ])
        ]
    ]));

    echo json_encode(['success' => 'Account created and saved to database!', 'redirect' => 'applicant_dashboard.php']);

} catch (Exception $e) {
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
