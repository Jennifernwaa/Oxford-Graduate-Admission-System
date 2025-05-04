<?php
session_start();
include('../dbcon.php');

// Get form key from session or URL parameter
$formKey = $_SESSION['formKey'] ?? '';

// If formKey is not in session but is in URL, use URL parameter
if (empty($formKey) && isset($_GET['id'])) {
    $formKey = $_GET['id'];
    $_SESSION['formKey'] = $formKey; // Store in session for future use
}

// Initialize form data array
$formData = [];

// If formKey exists, retrieve data from Firebase
if (!empty($formKey)) {
    $ref_path = "graduateForms/$formKey";
    $snapshot = $database->getReference($ref_path)->getValue();
    
    if ($snapshot) {
        $formData = $snapshot;
    }
}

// Check if user has permission to access this form
// Additional security checks can be added here
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
        .progressbarstyle{
            margin: 10px;
        }
        .oxford-blue-header.header {
            background-color: #002147;
            padding: 20px;
        }
        .logo {
            height: 60px;
            width: auto;
        }
        .nav-btn {
            margin-top: 20px;
            text-align: center;
        }
        .btn-primary {
            background-color: #002147 !important;
            border-color: #002147 !important;
        }
    </style>
</head>
<body>
    <header class="oxford-blue-header header">
        <img src="../icons/oxlogo-rect-border.svg" alt="logo" class="logo">
    </header>
    <div class="progress progressbarstyle border border-black" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped" style="width: 20%">20%</div>
    </div>
    <h2 class="text-center mb-4">APPLICATION FORM FOR GRADUATE STUDY 2020-21</h2>
    <form id="applicationForm" method="POST" action="form_page2_backend.php">
        <input type="hidden" name="formKey" value="<?php echo htmlspecialchars($formKey); ?>">
        
        <fieldset class="form-section">
            <legend>Section D: Contact Information</legend>
        
            <label for="homeAddress">Home Address:</label>
            <textarea class="form-control" id="homeAddress" name="homeAddress"><?= htmlspecialchars($formData['homeAddress'] ?? '') ?></textarea>
            <br>
        
            <label for="city">City:</label>
            <input type="text" id="city" name="city" class="form-control" value="<?= htmlspecialchars($formData['city'] ?? '') ?>">
            <br>
        
            <label for="postCode">Postcode/Zip Code:</label>
            <input type="text" id="postCode" name="postCode" class="form-control" value="<?= htmlspecialchars($formData['postCode'] ?? '') ?>">
            <br>
        
            <label for="state">State:</label>
            <input type="text" id="state" name="state" class="form-control" value="<?= htmlspecialchars($formData['state'] ?? '') ?>">
            <br>
        
            <label for="country">Country:</label>
            <input type="text" id="country" name="country" class="form-control" value="<?= htmlspecialchars($formData['country'] ?? '') ?>">
            <br>
        
            <label for="correspondenceAddress">Correspondence Address:</label>
            <textarea class="form-control" id="correspondenceAddress" name="correspondenceAddress"><?= htmlspecialchars($formData['correspondenceAddress'] ?? '') ?></textarea>
            <br>
        
            <label for="correspondenceCity">City:</label>
            <input type="text" id="correspondenceCity" name="correspondenceCity" class="form-control" value="<?= htmlspecialchars($formData['correspondenceCity'] ?? '') ?>">
            <br>
        
            <label for="correspondencePostCode">Postcode/Zip Code:</label>
            <input type="text" id="correspondencePostCode" name="correspondencePostCode" class="form-control" value="<?= htmlspecialchars($formData['correspondencePostCode'] ?? '') ?>">
            <br>
        
            <label for="correspondenceState">State:</label>
            <input type="text" id="correspondenceState" name="correspondenceState" class="form-control" value="<?= htmlspecialchars($formData['correspondenceState'] ?? '') ?>">
            <br>
        
            <label for="correspondenceCountry">Country:</label>
            <input type="text" id="correspondenceCountry" name="correspondenceCountry" class="form-control" value="<?= htmlspecialchars($formData['correspondenceCountry'] ?? '') ?>">
            <br>
        
            <label>Effective Dates (dd/mm/yy)</label>
            <br>
        
            <label for="effectiveFrom">From:</label>
            <input type="date" id="effectiveFrom" name="effectiveFrom" class="form-control" value="<?= htmlspecialchars($formData['effectiveFrom'] ?? '') ?>">
            <br>
        
            <label for="effectiveTo">To:</label>
            <input type="date" id="effectiveTo" name="effectiveTo" class="form-control" value="<?= htmlspecialchars($formData['effectiveTo'] ?? '') ?>">
            <br>
        
            <label for="telephone">Telephone:</label>
            <div class="row">
                <div class="col">
                    <label for="telephoneCountryCode">Country Code (if outside UK):</label>
                    <input type="text" id="telephoneCountryCode" name="telephoneCountryCode" class="form-control" value="<?= htmlspecialchars($formData['telephoneCountryCode'] ?? '') ?>">
                    <br>
                </div>
                <div class="col">
                    <label for="telephoneAreaCode">Area Code (if applicable):</label>
                    <input type="text" id="telephoneAreaCode" name="telephoneAreaCode" class="form-control" value="<?= htmlspecialchars($formData['telephoneAreaCode'] ?? '') ?>">
                    <br>
                </div>
                <div class="col">
                    <label for="telephoneNumber">Number:</label>
                    <input type="text" id="telephoneNumber" name="telephoneNumber" class="form-control" value="<?= htmlspecialchars($formData['telephoneNumber'] ?? '') ?>">
                    <br>
                </div>
            </div>
        
            <label for="alternativePhone">Alternative Phone Number:</label>
            <input type="text" id="alternativePhone" name="alternativePhone" class="form-control" value="<?= htmlspecialchars($formData['alternativePhone'] ?? '') ?>">
            <br>
        
            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" class="form-control" value="<?= htmlspecialchars($formData['email'] ?? '') ?>">
            <br>
        
            <label for="alternativeEmail">Alternative Email Address:</label>
            <input type="email" id="alternativeEmail" name="alternativeEmail" class="form-control" value="<?= htmlspecialchars($formData['alternativeEmail'] ?? '') ?>">
            <br>
        </fieldset>
        
        <fieldset class="form-section">
            <legend>Section E: Nominated third party</legend>
            <p><em>The University of Oxford will normally only discuss your application with you. If you wish to nominate a third party with whom we may discuss your application and accept direction on its handling, please provide their details. Note that a nominated third party will be able to amend or withdraw your application on your behalf.</em></p>
            <p>Do you wish to provide details of a nominated third party?</p>
            <input type="radio" id="thirdPartyYes" name="nominatedThirdParty" value="Yes" <?= (isset($formData['nominatedThirdParty']) && $formData['nominatedThirdParty'] === 'Yes') ? 'checked' : '' ?>> <label for="thirdPartyYes">Yes</label>
            <input type="radio" id="thirdPartyNo" name="nominatedThirdParty" value="No" <?= (isset($formData['nominatedThirdParty']) && $formData['nominatedThirdParty'] === 'No') ? 'checked' : '' ?>> <label for="thirdPartyNo">No</label>
            <br><br>
        
            <label for="thirdPartyName">Name of nominated third party:</label>
            <input type="text" id="thirdPartyName" name="thirdPartyName" class="form-control" value="<?= htmlspecialchars($formData['thirdPartyName'] ?? '') ?>">
            <br>
        
            <label for="thirdPartyEmail">Email address of nominated third party:</label>
            <input type="email" id="thirdPartyEmail" name="thirdPartyEmail" class="form-control" value="<?= htmlspecialchars($formData['thirdPartyEmail'] ?? '') ?>">
            <br>
        
            <label for="thirdPartyDOB">Date of birth of nominated third party:</label>
            <input type="date" id="thirdPartyDOB" name="thirdPartyDOB" class="form-control" value="<?= htmlspecialchars($formData['thirdPartyDOB'] ?? '') ?>">
        </fieldset>
        
        <fieldset class="form-section">
            <legend>Section F: Nationality</legend>
            <p><em>The details you provide on this page will be used to determine your fee status and eligibility for many scholarships. The details you give below should reflect your current situation, at the date you submit your application form.</em></p>
        
            <label for="countryOfBirth">Country of Birth:</label>
            <input type="text" id="countryOfBirth" name="countryOfBirth" class="form-control" value="<?= htmlspecialchars($formData['countryOfBirth'] ?? '') ?>">
            <br>
        
            <label for="nationality">Country of Nationality/Citizenship:</label>
            <p><em>In this section, give details of the countries of which you have nationality and the start date(s). If you have been a national of a country since birth, use your birth date as the 'From:' date under 'start date of nationality'. Please only include nationalities that you currently hold.</em></p>
        
            <p>Provide details of the countries of which you have nationality and the start date(s).</p>
            <p>Do you expect to require a visa to enter the UK for your study?</p>
            <input type="radio" id="visaYes" name="visaRequirement" value="Yes" <?= (isset($formData['visaRequirement']) && $formData['visaRequirement'] === 'Yes') ? 'checked' : '' ?>> <label for="visaYes">Yes</label>
            <input type="radio" id="visaNo" name="visaRequirement" value="No" <?= (isset($formData['visaRequirement']) && $formData['visaRequirement'] === 'No') ? 'checked' : '' ?>> <label for="visaNo">No</label>
            <input type="radio" id="visaUncertain" name="visaRequirement" value="Uncertain" <?= (isset($formData['visaRequirement']) && $formData['visaRequirement'] === 'Uncertain') ? 'checked' : '' ?>> <label for="visaUncertain">Uncertain</label>
            <p><strong>If you expect to require a visa to enter the UK for your study, please provide details of the passport that you intend to use.</strong></p>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>Nationality</th>
                        <th>Start Date of Nationality From (dd/mm/yyyy)</th>
                        <th>Passport Number</th>
                        <th>Country of Issue</th>
                        <th>Passport Expiry Date (dd/mm/yyyy)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" name="passportNationality" class="form-control" value="<?= htmlspecialchars($formData['passportNationality'] ?? '') ?>"></td>
                        <td><input type="date" name="passportStartDate" class="form-control" value="<?= htmlspecialchars($formData['passportStartDate'] ?? '') ?>"></td>
                        <td><input type="text" name="passportNumber" class="form-control" value="<?= htmlspecialchars($formData['passportNumber'] ?? '') ?>"></td>
                        <td><input type="text" name="passportCountry" class="form-control" value="<?= htmlspecialchars($formData['passportCountry'] ?? '') ?>"></td>
                        <td><input type="date" name="passportExpiryDate" class="form-control" value="<?= htmlspecialchars($formData['passportExpiryDate'] ?? '') ?>"></td>
                    </tr>
                </tbody>
            </table>
        
            <label for="dualNationality">If dual national:</label>
            <input type="text" id="dualNationality" name="dualNationality" class="form-control" value="<?= htmlspecialchars($formData['dualNationality'] ?? '') ?>">
            <br>
        
            <label for="currentCountryOfResidence">Current Country of Ordinary Residence:</label>
            <input type="text" id="currentCountryOfResidence" name="currentCountryOfResidence" class="form-control" value="<?= htmlspecialchars($formData['currentCountryOfResidence'] ?? '') ?>">
            <br>
        
            <label for="residenceFrom">From (dd/mm/yyyy):</label>
            <input type="date" id="residenceFrom" name="residenceFrom" class="form-control" value="<?= htmlspecialchars($formData['residenceFrom'] ?? '') ?>">
            <br>
        
            <label for="residenceTo">To (dd/mm/yyyy):</label>
            <input type="date" id="residenceTo" name="residenceTo" class="form-control" value="<?= htmlspecialchars($formData['residenceTo'] ?? '') ?>">
            <br>
        
            <p>I am an EU national resident in the UK for the main purpose of full-time education:</p>
            <input type="radio" id="euYes" name="euResident" value="Yes" <?= (isset($formData['euResident']) && $formData['euResident'] === 'Yes') ? 'checked' : '' ?>> <label for="euYes">Yes</label>
            <input type="radio" id="euNo" name="euResident" value="No" <?= (isset($formData['euResident']) && $formData['euResident'] === 'No') ? 'checked' : '' ?>> <label for="euNo">No</label>
            <br><br>
        
            <label for="previousCountryOfResidence">Previous Country of Residence:</label>
            <input type="text" id="previousCountryOfResidence" name="previousCountryOfResidence" class="form-control" value="<?= htmlspecialchars($formData['previousCountryOfResidence'] ?? '') ?>">
            <br>
        
            <label for="previousResidenceFrom">From (dd/mm/yyyy):</label>
            <input type="date" id="previousResidenceFrom" name="previousResidenceFrom" class="form-control" value="<?= htmlspecialchars($formData['previousResidenceFrom'] ?? '') ?>">
            <br>
        
            <label for="previousResidenceTo">To (dd/mm/yyyy):</label>
            <input type="date" id="previousResidenceTo" name="previousResidenceTo" class="form-control" value="<?= htmlspecialchars($formData['previousResidenceTo'] ?? '') ?>">
        </fieldset>
        
        <div class="nav-btn">
            <a href="form_page1.php" class="btn btn-warning">Back</a>
            <button type="submit" name="continue_2" class="btn btn-primary">Continue to Next Section</button>
        </div>
    </form>
</body>
</html>