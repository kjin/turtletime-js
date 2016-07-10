<?php
    $globalOptions = '';
    if (isset($_GET['globalOptions'])) {
        $globalOptions = $_GET['globalOptions'];
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            border: 0;
        }
    </style>
    <title>Turtle Time - Custom Options Enabled</title>
</head>
<script>
    // global stuff
    <?php
        echo 'localStorage.setItem("globalOptions", "' . $globalOptions . '")';
    ?>
</script>
<script src="js/phaser.min.js"></script>
<script src="js/main.js"></script>
<body></body>
</html>