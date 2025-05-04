<?php
session_start();
include('../dbcon.php');


$key_child = $_GET['id'] ?? '';


$formData = [];
$ref_path = "graduateForms/$formKey";
$snapshot = $database->getReference($ref_path)->getValue();

if ($snapshot) {
    $formData = $snapshot;
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            max-width: 1200px;
            margin: auto;
            background-color: #fff;
            padding: 20px;
            font-family: Arial, sans-serif;
            color: #000;
        }
        .form-section {
            background: white;
            padding: 15px;
            border: 1px solid black;
            margin-bottom: 20px;
        }
        .table-bordered td, .table-bordered th {
            border: 1px solid #000 !important;
            text-align: center;
            vertical-align: middle;
            width: 40px;
            height: 40px;
        }
        legend {
            font-weight: bold;
            font-size: 20px;
            text-transform: uppercase;
        }
        label {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
        }
        .form-control {
            border: 1px solid black;
        }
        .logo {
            height: 60px;
            width: auto;
        }
        .oxford-blue-header.header {
            background-color: #002147;
            padding: 20px;
        }
        .nav-btn {
            margin-top: 20px;
            text-align: center;
        }
        .btn-primary {
            background-color: #002147 !important;
            border-color: #002147 !important;
        }
        .progressbarstyle{
            margin: 10px;
        }
    </style>
</head>
<body>
<header class="oxford-blue-header header">
    <img src="../icons/oxlogo-rect-border.svg" alt="logo" class="logo">
</header>
<div class="progress progressbarstyle border border-black" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar progress-bar-striped" style="width: 10%">10%</div>
</div>
<h2 class="text-center mb-4">APPLICATION FORM FOR GRADUATE STUDY 2020-21</h2>
<form id="applicationForm" method="POST" action="form_page1_backend.php">
    <fieldset class="form-section">
        <legend>Section A: About Your Course</legend>
        <label for="courseCode">Course Code:</label>
        <input type="text" id="courseCode" name="courseCode" class="form-control"
               value="<?= htmlspecialchars($formData['courseCode'] ?? '') ?>">
        <label for="courseTitle">Course Title:</label>
        <input type="text" id="courseTitle" name="courseTitle" class="form-control"
               value="<?= htmlspecialchars($formData['courseTitle'] ?? '') ?>">
        <label for="researchProject">Research Project Title:</label>
        <textarea id="researchProject" name="researchProject" class="form-control"><?= htmlspecialchars($formData['researchProject'] ?? '') ?></textarea>
        <label for="supervisorName">Proposed Supervisor Name(s):</label>
        <input type="text" id="supervisorName" name="supervisorName" class="form-control"
               value="<?= htmlspecialchars($formData['supervisorName'] ?? '') ?>">
        <label for="interviewDates">Unavailable Interview Dates:</label>
        <input type="text" id="interviewDates" name="interviewDates" class="form-control"
               value="<?= htmlspecialchars($formData['interviewDates'] ?? '') ?>">
        <p>Apply for Research Degree after this Course?</p>
        <input type="radio" id="yes" name="researchDegree" value="Yes"
            <?= (isset($formData['researchDegree']) && $formData['researchDegree'] === 'Yes') ? 'checked' : '' ?>>
        <label for="yes">Yes</label>
        <input type="radio" id="no" name="researchDegree" value="No"
            <?= (isset($formData['researchDegree']) && $formData['researchDegree'] === 'No') ? 'checked' : '' ?>>
        <label for="no">No</label>
        <input type="radio" id="unsure" name="researchDegree" value="Unsure"
            <?= (isset($formData['researchDegree']) && $formData['researchDegree'] === 'Unsure') ? 'checked' : '' ?>>
        <label for="unsure">Unsure</label>
    </fieldset>
    <fieldset class="form-section">
        <legend>Section B: College Preference</legend>
        <input type="radio" id="noCollegePref" name="collegePreference" value="No preference"
            <?= (isset($formData['collegePreference']) && $formData['collegePreference'] === 'No preference') ? 'checked' : '' ?>>
        <label for="noCollegePref">I have no college preference</label>
        <p>Or enter your college preference below:</p>
        <input type="text" id="collegePref" name="collegePreference" class="form-control"
               value="<?= htmlspecialchars($formData['collegePreference'] ?? '') ?>">
    </fieldset>
    <fieldset class="form-section">
        <legend>Section C: Personal Details</legend>
        <label for="givenName">Given Name:</label>
        <input type="text" id="givenName" name="givenName" class="form-control" required
               value="<?= htmlspecialchars($formData['givenName'] ?? '') ?>">
        <label for="preferredName">Preferred Name:</label>
        <input type="text" id="preferredName" name="preferredName" class="form-control"
               value="<?= htmlspecialchars($formData['preferredName'] ?? '') ?>">
        <label for="middledName">Middle Name(s):</label>
        <input type="text" id="middledName" name="middledName" class="form-control"
               value="<?= htmlspecialchars($formData['middleName'] ?? '') ?>">
        <label for="familyName">Family Name:</label>
        <input type="text" id="familyName" name="familyName" class="form-control" required
               value="<?= htmlspecialchars($formData['familyName'] ?? '') ?>">
        <label for="titleName">Title:</label>
        <input type="text" id="titleName" name="titleName" class="form-control"
               value="<?= htmlspecialchars($formData['titleName'] ?? '') ?>">
        <p>Sex:</p>
        <input type="radio" id="female" name="gender" value="Female"
            <?= (isset($formData['gender']) && $formData['gender'] === 'Female') ? 'checked' : '' ?>>
        <label for="female">Female</label>
        <input type="radio" id="male" name="gender" value="Male"
            <?= (isset($formData['gender']) && $formData['gender'] === 'Male') ? 'checked' : '' ?>>
        <label for="male">Male</label>
        <label for="dob">Date of Birth:</label>
        <input type="date" id="dob" name="dob" class="form-control" required
               value="<?= htmlspecialchars($formData['dob'] ?? '') ?>">
    </fieldset>
    <div class="nav-btn">
        <button type="submit" name="continue_1" class="btn btn-primary">Continue to Next Section</button>
    </div>
</form>
</body>
</html>