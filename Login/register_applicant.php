<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create an Account</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

  <style>
    /* Styles remain the same */
  </style>
</head>

<body>
  <header class="oxford-blue-header header">
    <img src="../icons/oxlogo-rect-border.svg" alt="logo" class="logo" />
  </header>

  <h1>Create an Account</h1>

  <div class="login-container">
    <div class="login-form">
      <?php
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
          $email = trim($_POST['email'] ?? '');
          $password = $_POST['password'] ?? '';
          if (empty($email) || empty($password)) {
              echo "<div class='error-message'>Please enter email and password.</div>";
          } else {
              try {
                  $firebaseConfig = [
                      'apiKey' => 'AIzaSyCbSqQtKpBtfu6EqTCyk5uTNkFiEc7jejU',
                      'databaseURL' => 'https://oxford-graduate-admission-default-rtdb.asia-southeast1.firebasedatabase.app/'
                  ];
                  // Register user
                  $authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' . $firebaseConfig['apiKey'];
                  $authResponse = file_get_contents($authUrl, false, stream_context_create([
                      'http' => [
                          'method' => 'POST',
                          'header' => 'Content-Type: application/json',
                          'content' => json_encode(['email' => $email, 'password' => $password, 'returnSecureToken' => true])
                      ]
                  ]));
                  $authData = json_decode($authResponse, true);
                  if (isset($authData['error'])) {
                      echo "<div class='error-message'>{$authData['error']['message']}</div>";
                  } else {
                      $uid = $authData['localId'];

                      // Store user data in Firebase Realtime Database
                      $dbUrl = $firebaseConfig['databaseURL'] . 'users/' . $uid . '.json';
                      file_get_contents($dbUrl, false, stream_context_create([
                          'http' => [
                              'method' => 'PUT',
                              'header' => 'Content-Type: application/json',
                              'content' => json_encode(['username' => $email, 'password' => $password, 'role' => 'Applicant'])
                          ]
                      ]));

                      // Now, log the user in by using the Firebase authentication API (signIn)
                      $signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' . $firebaseConfig['apiKey'];
                      $signInResponse = file_get_contents($signInUrl, false, stream_context_create([
                          'http' => [
                              'method' => 'POST',
                              'header' => 'Content-Type: application/json',
                              'content' => json_encode(['email' => $email, 'password' => $password, 'returnSecureToken' => true])
                          ]
                      ]));
                      $signInData = json_decode($signInResponse, true);

                      // Check if sign-in is successful
                      if (isset($signInData['error'])) {
                          echo "<div class='error-message'>{$signInData['error']['message']}</div>";
                      } else {
                          // Redirect to applicant dashboard
                          header('Location: ../Applicant/applicant_dashboard.html');
                          exit;
                      }
                  }
              } catch (Exception $e) {
                  echo "<div class='error-message'>Server error: " . $e->getMessage() . "</div>";
              }
          }
      }
      ?>
      <form action="" method="POST">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" class="btn btn-warning">Register</button>
      </form>
      <div class="login-link">
        <p>Already have an account? <a href="login_applicant_page.html">Login</a></p>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
