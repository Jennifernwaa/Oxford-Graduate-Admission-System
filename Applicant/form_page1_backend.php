<?php
session_start();
include('../dbcon.php');
if (isset($_POST['continue_1'])) {
// Gather data
$postData = [
'courseCode' => $_POST['courseCode'],
'courseTitle' => $_POST['courseTitle'],
'researchProject' => $_POST['researchProject'],
'supervisorName' => $_POST['supervisorName'],
'interviewDates' => $_POST['interviewDates'],
'researchDegree' => $_POST['researchDegree'] ?? '',
'collegePreference' => $_POST['collegePreference'] ?? '',
'givenName' => $_POST['givenName'],
'preferredName' => $_POST['preferredName'],
'middleName' => $_POST['middledName'],
'familyName' => $_POST['familyName'],
'titleName' => $_POST['titleName'],
'gender' => $_POST['gender'] ?? '',
'dob' => $_POST['dob'],
 ];
// Push new form with unique key: graduateForms/{uid}/{unique_form_key}
$ref_path = "graduateForms";
$newFormRef = $database->getReference($ref_path)->push($postData);
$formKey = $newFormRef->getKey(); // This is the unique form ID
// Save formKey in session for further steps
$_SESSION['formKey'] = $formKey;
if ($formKey) {
$_SESSION['status'] = "Form submitted successfully.";
header("Location: form_page2.php?id=<?=$formKey;?>");
exit();
 } else {
$_SESSION['status'] = "Failed to submit the form.";
header("Location: applicant_dashboard.php");
exit();
 }
}
?>