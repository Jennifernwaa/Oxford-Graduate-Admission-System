<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create an Account</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

  <style>
    .oxford-blue-header {
      background-color: #002147;
      color: white;
      padding: 20px 0;
      text-align: center;
    }

    .logo {
      height: 70px;
    }

    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .login-form {
      background-color: #e0e0e0;
      padding: 30px;
      width: 500px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      transform: translateY(-150px);
    }

    .error-message {
      color: red;
      margin-top: 10px;
      text-align: center;
    }

    .login-link {
      margin-top: 15px;
      text-align: center;
    }

    .login-link a {
      color: #002147;
      text-decoration: none;
      font-weight: bold;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    h1 {
      text-align: center;
      margin-top: 20px;
      color: #333;
    }
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
                      $dbUrl = $firebaseConfig['databaseURL'] . 'users/' . $uid . '.json';
                      file_get_contents($dbUrl, false, stream_context_create([
                          'http' => [
                              'method' => 'PUT',
                              'header' => 'Content-Type: application/json',
                              'content' => json_encode(['username' => $email,'password' => $password, 'role' => 'Applicant'])
                          ]
                      ]));
                      header('Location: ../Applicant/applicant_dashboard.html');
                      exit;
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
