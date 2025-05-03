<?php
// You can add any PHP logic here if needed, such as checking form submission status
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Submission Successful</title>
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }

    /* Background from form_page11.html */
    .background {
      background-color: #f4f4f4; /* Same background as form_page11 */
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .modal {
      display: block;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      padding-top: 60px;
    }

    .modal-content {
      background-color: #fff;
      margin: 5% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 400px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .success-icon {
      color: #28a745;
      font-size: 4em;
      margin-bottom: 20px;
    }

    .modal .button {
      background-color: #002147;
      color: white;
      padding: 12px 24px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .modal .button:hover {
      background-color: #0056b3;
    }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>

<!-- Background from form_page11.html -->
<div class="background">
  <!-- Success Modal -->
  <div class="modal">
    <div class="modal-content">
      <i class="fas fa-check-circle success-icon"></i>
      <h2>Submission Successful!</h2>
      <p>Thank you for your submission. We have received your information and will process it accordingly.</p>
      <a href="applicant_dashboard.php" class="button">Go Back to Dashboard</a>
    </div>
  </div>
</div>

<script>
  // Optional: You can add a timeout to close the modal after a few seconds
  setTimeout(function() {
    window.location.href = "applicant_dashboard.php";  // Redirect after 5 seconds
  }, 20000);  // 5000ms = 5 seconds
</script>

</body>
</html>
