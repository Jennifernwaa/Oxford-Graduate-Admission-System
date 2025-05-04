<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet"> 
    <style>
        .page-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
        }
        .oxford-blue {
            background-color: #002147;
            color: white;
        }
        .header {
            padding: 20px 0;
        }
        .logo {
            height: 70px;
            margin-right: 20px;
        }
        .applications-overview,
        .important-dates {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .applications-overview h2,
        .important-dates h2 {
            margin-bottom: 20px;
            color: #002147;
            font-size: 1.8em;
        }
        .application-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        .application-card h3 {
            margin: 0 0 10px;
            color: #002147;
            font-size: 1.2em;
        }
        .application-card p {
            color: #555;
        }
        .application-status {
            font-weight: bold;
            color: #28a745;
        }
        .application-status.in-progress {
            color: #17a2b8;
        }
        .details-link {
            display: inline-block;
            padding: 10px 15px;
            background-color: #002147;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 0.9em;
        }
        .details-link:hover {
            background-color: #0056b3;
        }
        .dates-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .dates-list li {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #ddd;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <header class="oxford-blue header">
        <div class="container">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img src="../icons/oxlogo-rect-border.svg" alt="University of Oxford Logo" class="logo">
                    <h2>Applicant Dashboard</h2>
                </div>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search..." aria-label="Search">
                    <button class="btn btn-outline-light" type="submit"><i class="bi bi-search"></i></button>
                </form>
            </div>
        </div>
    </header>

    <div class="page-container">
        <div class="dashboard-content">
            <section class="applications-overview">
                <h2>Your Application</h2>

                <?php
                    // Replace with actual user session logic
                    $user_id = 123; 

                    // Dummy data: Replace with your DB query result
                    $application = [
                        'id' => 'OXF001',
                        'program' => 'Master of Science in Computer Science',
                        'status' => 'In Progress'
                    ];

                    if ($application):
                ?>
                    <div class="application-card">
                        <h3>Application #<?= htmlspecialchars($application['id']) ?></h3>
                        <p>Program: <?= htmlspecialchars($application['program']) ?></p>
                        <p>Status: <span class="application-status <?= $application['status'] === 'In Progress' ? 'in-progress' : '' ?>">
                            <?= htmlspecialchars($application['status']) ?>
                        </span></p>
                        <a href="form_page1.php" class="details-link">
                            <?= $application['status'] === 'In Progress' ? 'Continue Application' : 'View Application' ?>
                        </a>
                    </div>
                <?php else: ?>
                    <p>No application found. <a href="form_page1.php">Start your application here</a>.</p>
                <?php endif; ?>
            </section>

            <section class="important-dates">
                <h2>Important Dates</h2>
                <ul class="dates-list">
                    <li><span class="date-label">Application Deadline:</span><span class="date-value">January 15, 2025</span></li>
                    <li><span class="date-label">Admission Decisions Released:</span><span class="date-value">March 30, 2025</span></li>
                    <li><span class="date-label">Orientation Begins:</span><span class="date-value">September 1, 2025</span></li>
                </ul>
            </section>
        </div>
    </div>
</body>
</html>
