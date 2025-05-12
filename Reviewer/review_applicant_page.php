<?php
require "script.php";?>
<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $email = filter_var($_POST['applicantEmail'], FILTER_VALIDATE_EMAIL);
    $full_name = htmlspecialchars($_POST['applicantName']);
    $status = htmlspecialchars($_POST['statusField']);

    // Validate input
    if (!$email || !$full_name || !$status) {
        echo json_encode(["status" => "error", "message" => "Invalid input data."]);
        exit;
    }

    // Prepare email subject and message
    $subject = "Application Status Update";
    $message = "Dear $full_name,<br><br>";

    if ($status === "Accepted") {
        $message .= "We are delighted to inform you that your application has been <strong>Accepted</strong>.<br><br>";
        $message .= "Congratulations on this achievement! Further details will be communicated to you shortly.<br><br>";
    } elseif ($status === "Rejected") {
        $message .= "We regret to inform you that your application has been <strong>Rejected</strong>.<br><br>";
        $message .= "We appreciate your interest in our program and thank you for your effort.<br><br>";
    } elseif ($status === "Request Additional Documents") {
        $message .= "We require additional documents to proceed with your application.<br><br>";
        $message .= "Please check your application portal for further instructions.<br><br>";
    }

    $message .= "Best regards,<br>The Admissions Team<br>University of Oxford";

    // Send the email
    $result = sendMail($email, $subject, $message);

    if ($result === "success") {
        echo json_encode(["status" => "success", "message" => "Email sent successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to send email. Error: $result"]);
    }
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <script type="module" src="review_applicant_page.js" defer></script>
    <style>
        .oxford-blue {
            background-color: #002147; /* Oxford Blue */
            color: white;
        }
        .header {
            padding: 20px 0; /* Adjust vertical padding */
        }
        .logo {
            height: 70px; /* Adjust logo size */
            margin-right: 20px;
        }
        .sidebar {
            background-color: #f8f9fa;
            padding-top: 20px;
            border-right: 1px solid #dee2e6;
            min-height: 100vh; /* Make sidebar full height */
        }
        .sidebar-item {
            padding: 10px 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .sidebar-item:hover {
            background-color: #e9ecef;
        }
        .content {
            padding: 20px;
        }
        .card {
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
        }
        .card-header {
            background-color: #e9ecef;
            padding: 10px 15px;
            border-bottom: 1px solid #dee2e6;
        }
        .card-body {
            padding: 15px;
        }
        .form-control {
            margin-bottom: 10px;
        }
        .btn-primary {
            background-color: #002147;
            border-color: #002147;
        }
        .btn-primary:hover {
            background-color: #001836;
            border-color: #001836;
        }
        .btn-outline-light {
            border: none; /* Remove the border */
            background-color: transparent; /* Ensure the background is transparent */
        }
        .btn-outline-light:hover {
            background-color: transparent; /* Disable hover effect */
            color: inherit; /* Keep the same color when hovered */
        }
        input[type="radio"] {
          width: 18px;
          height: 18px;
          transform: scale(1); /* optional: increases the visual size */
          margin-right: 5px;
          margin-left: 5px;
          accent-color: #002147; /* optional: changes the dot color */
          cursor: pointer;
        }
        .applicant-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .applicant-table td {
            padding: 8px;
            border-bottom: 1px solid #f0f0f0;
        }
        .applicant-table td:first-child {
            width: 200px;
            font-weight: 500;
        }
        .document-link {
            color: #002147;
            text-decoration: underline;
            margin-right: 15px;
        }
        .back-button {
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <header class="oxford-blue header">
        <div class="container">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img src="../icons/oxlogo-rect-border.svg" alt="University of Oxford Logo" class="logo">
                    <h2>Application Review</h2>
                </div>
                <!-- <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search..." aria-label="Search" style="margin-top: 4px;">
                        <i class="bi bi-search" style="position: relative; top: 0px;"></i>
                    </button>
                </form> -->
            </div>
        </div>
    </header>

    <div class="container-fluid">
        <div class="row">
            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block sidebar">
                <div class="position-sticky">
                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>Application Review</span>
                    </h6>
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link sidebar-item" href="reviewer_dashboard.html">
                                <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link sidebar-item active" href="#applicant-details">
                                <i class="bi bi-person me-2"></i>Applicant Details
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link sidebar-item" href="#evaluation-form">
                                <i class="bi bi-file-earmark-text me-2"></i>Evaluation Form
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 content">
                <div class="container">
                    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h2>Graduate Application Review</h2>
                        <a href="reviewer_dashboard.html" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left"></i> Back to Dashboard
                        </a>
                    </div>
                    
                    <div class="card p-4">
                        <h4 id="applicant-details" class="mb-4">Applicant Details</h4>
                        <table class="applicant-table">
                            <!-- This table will be filled by JavaScript -->
                        </table>
                        
                        <h5 class="mt-4 mb-3">Supporting Documents</h5>
                        <div class="mb-4">
                            <a href="#" class="document-link"><i class="bi bi-file-text"></i> Personal Statement</a>
                            <a href="#" class="document-link"><i class="bi bi-file-pdf"></i> Transcript</a>
                            <a href="#" class="document-link"><i class="bi bi-file-pdf"></i> Recommendation Letter</a>
                            <a href="#" class="document-link"><i class="bi bi-file-pdf"></i> CV/Resume</a>
                        </div>
                        
                        <h5 id="evaluation-form" class="mt-5 mb-3">Evaluation Form</h5>
                        <div class="mb-3">
                            <label class="form-label"><strong>Academic Qualifications</strong></label>
                            <input type="radio" name="academic" id="excellent" value="Excellent"> <label class="radio-label" for="excellent">Excellent</label>
                            <input type="radio" name="academic" id="good" value="Good"> <label class="radio-label" for="good">Good</label>
                            <input type="radio" name="academic" id="satisfactory" value="Satisfactory"> <label class="radio-label" for="satisfactory">Satisfactory</label>
                            <input type="radio" name="academic" id="poor" value="Poor"> <label class="radio-label" for="poor">Poor</label>
                        </div>

                        <div class="mb-3">
                            <label class="form-label"><strong>Research Potential</strong></label>
                            <input type="radio" name="research" id="r-excellent" value="Excellent"> <label class="radio-label" for="r-excellent">Excellent</label>
                            <input type="radio" name="research" id="r-good" value="Good"> <label class="radio-label" for="r-good">Good</label>
                            <input type="radio" name="research" id="r-satisfactory" value="Satisfactory"> <label class="radio-label" for="r-satisfactory">Satisfactory</label>
                            <input type="radio" name="research" id="r-poor" value="Poor"> <label class="radio-label" for="r-poor">Poor</label>
                        </div>

                        <div class="mb-3">
                            <label class="form-label"><strong>Letters of Recommendation</strong></label>
                            <input type="radio" name="recommendation" id="lr-excellent" value="Excellent"> <label class="radio-label" for="lr-excellent">Excellent</label>
                            <input type="radio" name="recommendation" id="lr-good" value="Good"> <label class="radio-label" for="lr-good">Good</label>
                            <input type="radio" name="recommendation" id="lr-satisfactory" value="Satisfactory"> <label class="radio-label" for="lr-satisfactory">Satisfactory</label>
                            <input type="radio" name="recommendation" id="lr-poor" value="Poor"> <label class="radio-label" for="lr-poor">Poor</label>
                        </div>

                        <div class="mb-3">
                            <label class="form-label"><strong>Motivation and Fit</strong></label>
                            <input type="radio" name="motivation" id="m-excellent" value="Excellent"> <label class="radio-label" for="m-excellent">Excellent</label>
                            <input type="radio" name="motivation" id="m-good" value="Good"> <label class="radio-label" for="m-good">Good</label>
                            <input type="radio" name="motivation" id="m-satisfactory" value="Satisfactory"> <label class="radio-label" for="m-satisfactory">Satisfactory</label>
                            <input type="radio" name="motivation" id="m-poor" value="Poor"> <label class="radio-label" for="m-poor">Poor</label>
                        </div>

                        <div class="mb-3">
                            <label class="form-label"><strong>Overall Impression</strong></label>
                            <input type="radio" name="overall" id="o-excellent" value="Excellent"> <label class="radio-label" for="o-excellent">Excellent</label>
                            <input type="radio" name="overall" id="o-good" value="Good"> <label class="radio-label" for="o-good">Good</label>
                            <input type="radio" name="overall" id="o-satisfactory" value="Satisfactory"> <label class="radio-label" for="o-satisfactory">Satisfactory</label>
                            <input type="radio" name="overall" id="o-poor" value="Poor"> <label class="radio-label" for="o-poor">Poor</label>
                        </div>
                              
                            <div class="mb-4">
                                <label class="form-label"><strong>Comments</strong></label>
                                <textarea class="form-control" rows="5" placeholder="Enter your review comments here..."></textarea>
                            </div>
                            <form id="reviewForm" method="POST" action="review_applicant_page.php">
                                <!-- Hidden inputs -->
                                <input type="hidden" name="applicantEmail" id="applicantEmail" value="">
                                <input type="hidden" name="applicantName" id="applicantName" value="">
                                <input type="hidden" name="statusField" id="statusField" value="">

                                <!-- Buttons -->
                                <button type="submit" id="acceptButton" class="btn btn-primary">Accept</button>
                                <button type="submit" id="rejectButton" class="btn btn-danger">Reject</button>
                                <button type="submit" id="requestDocsButton" class="btn btn-secondary">Request Additional Documents</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>
</html>


<script>
function setStatus(status) {
    const statusField = document.getElementById('statusField');
    const applicantEmail = document.getElementById('applicantEmail');
    const applicantName = document.getElementById('applicantName');

    if (!statusField || !applicantEmail || !applicantName) {
        console.error("One or more hidden inputs are missing.");
        return;
    }

    statusField.value = status;

    console.log("Status set to:", status);
    console.log("Email:", applicantEmail.value);
    console.log("Name:", applicantName.value);
}


</script>