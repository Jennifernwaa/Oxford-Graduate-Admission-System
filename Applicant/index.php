
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
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
            background-color: #002147; /* Oxford Blue */
            padding: 20px; /* Adds spacing inside the header */
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
        <img src="oxlogo-rect-border.svg" alt="logo" class="logo">
    </header>

    <div class="progress progressbarstyle border border-black"  role="progressbar" aria-label="Default striped example" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped" style="width: 10%">10%</div>
    </div>

    <h2 class="text-center mb-4">APPLICATION FORM FOR GRADUATE STUDY 2020-21</h2>
    
    <div class="form-section text-center">
        <p><strong>FOR OFFICE USE ONLY:</strong></p>
        <table class="table table-bordered mx-auto" style="width: 300px;">
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>
    
    <p class="text-center">Before completing this form, please refer to the Graduate Admissions Application Guide (available at <a href="https://www.graduate.ox.ac.uk/applicationguide" target="_blank">www.graduate.ox.ac.uk/applicationguide</a>).</p>
    <p class="text-center">Any errors resulting from failure to do so may delay your application.</p>
    
    <form>
        <fieldset class="form-section">
        <legend>Section A: About Your Course</legend>
    <p><em>This form may only be used to apply for one course. If you wish to apply for more than one course, you must submit a separate application form and pay the £75 application fee each time.</em></p>
    <label for="courseCode">State the course code as given on the course page:</label>
    <input type="text" id="courseCode" class="form-control">
    <p><a href="https://www.ox.ac.uk/admissions/graduate/courses">www.ox.ac.uk/admissions/graduate/courses</a></p>
    <label for="courseTitle">Title of the course:</label>
    <input type="text" id="courseTitle" class="form-control">
    <p><em>For certain courses, you may need to supply additional information. If (iii) and (iv) do not apply, please continue to the next question.</em></p>
    <p><strong>For research courses (e.g. DPhil, MSc by Research (MRes), etc.):</strong></p>
    <label for="researchProject">State the proposed field and title of research project:</label>
    <textarea id="researchProject" class="form-control"></textarea>
    <br>
    <label for="supervisorName">Proposed supervisor name(s) (if known):</label>
    <input type="text" id="supervisorName" class="form-control">
    <br>
    <p><strong>For all courses</strong></p>
    <label for="interviewDates">Date(s) unavailable for interview or visit:</label>
    <input type="text" id="interviewDates" class="form-control">
    <br>
    <p><strong>For Masters courses</strong></p>
    <p>Do you intend to apply for a research degree after completing this course?</p>
    <input type="radio" id="yes" name="researchDegree" value="Yes"> <label for="yes">Yes</label>
    <input type="radio" id="no" name="researchDegree" value="No"> <label for="no">No</label>
    <input type="radio" id="unsure" name="researchDegree" value="Unsure"> <label for="unsure">Unsure</label>
    </fieldset>

    <fieldset class="form-section">
        <legend>Section B: College Preference</legend>
        <p><em>If you are applying to a course involving college membership, please indicate below whether you have a college preference or
            whether you wish the University to select a college on your behalf. It is not possible to amend your college preference once you
            have submitted your application.</em></p>
        <p><em>Details of which colleges accept for which courses may be found on our website at</em></p>
        <p><a href="http://www.graduate.ox.ac.uk/courses">www.graduate.ox.ac.uk/courses</a></p>
        <label>College Preference:</label>
        <br>
        <input type="radio" id="noCollegePref" name="noCollegePref"> <label for="noCollegePref">I have no college preference</label>
        <br><br>
        <p>My college preference is:</p>
        <input type="text" class="form-control" id="collegePref">
    </fieldset>

    <fieldset class="form-section">
        <legend>Section C: Personal Details</legend>
        <p><strong>Please enter your name exactly as it appears on your passport or other official document, including middle names. If you go by
            a name that is not listed on your official document(s), you can enter this in the Preferred Name field.</strong></p>
        <label for="givenName">Given Name (Forename):</label>
        <input type="text" class="form-control" id="givenName" required>
        <br>
        <label for="givenName">Preferred name:</label>
        <input type="text" class="form-control" id="preferredName" required>
        <br>
        <label for="givenName">Middle name(s):</label>
        <input type="text" class="form-control" id="middledName">
        <br>
        <label for="familyName">Family Name (Surname):</label>
        <input type="text" class="form-control" id="familyName" required>
        <br>
        <label for="familyName">Title (Miss, Mr, Mrs, Ms, Mx, Dr, Professor, Reverend, No Title):</label>
        <input type="text" class="form-control" id="titleName" required>
        <br>
        <p>Sex:</p>
        <input type="radio" id="Female" name="femGender" value="Female"> <label for="Female">Female</label>
        <input type="radio" id="Male" name="maleGender" value="Male"> <label for="Male">Male</label>
        <br></br>
        <label for="dob">Date of Birth:</label>
        <input type="date" class="form-control" id="dob" required>
    </fieldset>

    <div class="nav-btn">
        <input class="btn btn-warning" type="reset" value="Reset">
        <a href="daisysection2.html" class="btn btn-primary">Continue to Next Section</a>
    </div>
    </form>
</body>
</html>
