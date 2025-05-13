<?php
require __DIR__ . '/../vendor/autoload.php';

use Kreait\Firebase\Factory;

// Initialize Firebase
$factory = (new Factory)
    ->withServiceAccount(__DIR__ . '/../Oxford-Graduate-Admission-System/oxford-graduate-admission-firebase-adminsdk-fbsvc-77f5c6979e.json');
$firestore = $factory->createFirestore();
$database = $firestore->database();

// Validate incoming data
if (!isset($_FILES['signFile']) || !isset($_POST['uid'])) {
    http_response_code(400);
    echo "Missing file or UID.";
    exit;
}

$uid = $_POST['uid'];
$uploadDir = __DIR__ . '/../uploads/';
$baseUrl = 'http://localhost:8888/Oxford-Graduate-Admission-System/uploads/';

// Validate file type and size
$allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

$fileType = $_FILES['signFile']['type'];
$fileSize = $_FILES['signFile']['size'];

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo "Invalid file type. Only JPG, PNG, and PDF are allowed.";
    exit;
}

if ($fileSize > $maxFileSize) {
    http_response_code(400);
    echo "File too large. Max allowed size is 5MB.";
    exit;
}

// Save the file
$originalName = basename($_FILES['signFile']['name']);
$safeName = uniqid() . "_" . preg_replace("/[^a-zA-Z0-9.\-_]/", "_", $originalName);
$targetFile = $uploadDir . $safeName;

if (!move_uploaded_file($_FILES['signFile']['tmp_name'], $targetFile)) {
    http_response_code(500);
    echo "Failed to save file.";
    exit;
}

$publicUrl = $baseUrl . $safeName;

// Sync to Firestore under: users/{uid}/forms/form11
try {
    $docRef = $database->collection('users')->document($uid)
                      ->collection('forms')->document('form11');

    $docRef->set([
        'signature_url' => $publicUrl,
        'filename' => $originalName,
        'uploaded_at' => date("Y-m-d H:i:s")
    ], ['merge' => true]);

    echo "✅ File uploaded and synced to Firestore!\n";
    echo "📎 URL: " . $publicUrl;
} catch (Exception $e) {
    http_response_code(500);
    echo "Error syncing to Firestore: " . $e->getMessage();
}
?>
