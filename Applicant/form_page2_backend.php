<?php
session_start();
include('../dbcon.php');

if (isset($_POST['continue_2'])) {
    // Get form key from post data
    $formKey = $_POST['formKey'] ?? '';
    
    // If formKey is empty, redirect to first page
    if (empty($formKey)) {
        $_SESSION['status'] = "Error: Form ID not found";
        header("Location: form_page1.php");
        exit();
    }
    
    // Gather form data
    $postData = [
        // Contact Information
        'homeAddress' => $_POST['homeAddress'] ?? '',
        'city' => $_POST['city'] ?? '',
        'postCode' => $_POST['postCode'] ?? '',
        'state' => $_POST['state'] ?? '',
        'country' => $_POST['country'] ?? '',
        'correspondenceAddress' => $_POST['correspondenceAddress'] ?? '',
        'correspondenceCity' => $_POST['correspondenceCity'] ?? '',
        'correspondencePostCode' => $_POST['correspondencePostCode'] ?? '',
        'correspondenceState' => $_POST['correspondenceState'] ?? '',
        'correspondenceCountry' => $_POST['correspondenceCountry'] ?? '',
        'effectiveFrom' => $_POST['effectiveFrom'] ?? '',
        'effectiveTo' => $_POST['effectiveTo'] ?? '',
        'telephoneCountryCode' => $_POST['telephoneCountryCode'] ?? '',
        'telephoneAreaCode' => $_POST['telephoneAreaCode'] ?? '',
        'telephoneNumber' => $_POST['telephoneNumber'] ?? '',
        'alternativePhone' => $_POST['alternativePhone'] ?? '',
        'email' => $_POST['email'] ?? '',
        'alternativeEmail' => $_POST['alternativeEmail'] ?? '',
        
        // Third party information
        'nominatedThirdParty' => $_POST['nominatedThirdParty'] ?? '',
        'thirdPartyName' => $_POST['thirdPartyName'] ?? '',
        'thirdPartyEmail' => $_POST['thirdPartyEmail'] ?? '',
        'thirdPartyDOB' => $_POST['thirdPartyDOB'] ?? '',
        
        // Nationality information
        'countryOfBirth' => $_POST['countryOfBirth'] ?? '',
        'visaRequirement' => $_POST['visaRequirement'] ?? '',
        'passportNationality' => $_POST['passportNationality'] ?? '',
        'passportStartDate' => $_POST['passportStartDate'] ?? '',
        'passportNumber' => $_POST['passportNumber'] ?? '',
        'passportCountry' => $_POST['passportCountry'] ?? '',
        'passportExpiryDate' => $_POST['passportExpiryDate'] ?? '',
        'dualNationality' => $_POST['dualNationality'] ?? '',
        'currentCountryOfResidence' => $_POST['currentCountryOfResidence'] ?? '',
        'residenceFrom' => $_POST['residenceFrom'] ?? '',
        'residenceTo' => $_POST['residenceTo'] ?? '',
        'euResident' => $_POST['euResident'] ?? '',
        'previousCountryOfResidence' => $_POST['previousCountryOfResidence'] ?? '',
        'previousResidenceFrom' => $_POST['previousResidenceFrom'] ?? '',
        'previousResidenceTo' => $_POST['previousResidenceTo'] ?? '',
        'currentPage' => 2,
        'lastUpdated' => date('Y-m-d H:i:s')
    ];
    
    // Get current form data to merge with new data
    $ref_path = "graduateForms/$formKey";
    $currentData = $database->getReference($ref_path)->getValue();
    
    // Merge existing data with new data
    $updatedData = is_array($currentData) ? array_merge($currentData, $postData) : $postData;
    
    // Update the form data in Firebase
    $database->getReference($ref_path)->update($updatedData);
    
    // Store formKey in session for next pages
    $_SESSION['formKey'] = $formKey;
    
    // Redirect to next page
    $_SESSION['status'] = "Form page 2 submitted successfully.";
    header("Location: form_page3.php?id=$formKey");
    exit();
} else {
    // If form was not submitted properly
    $_SESSION['status'] = "Form not submitted properly.";
    // Redirect back to form page 2 if we have the form key
    if (isset($_SESSION['formKey'])) {
        header("Location: form_page2.php?id=" . $_SESSION['formKey']);
    } else {
        // Otherwise redirect to page 1
        header("Location: form_page1.php");
    }
    exit();
}
?>