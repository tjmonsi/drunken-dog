<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 10:00 PM
 * To change this template use File | Settings | File Templates.
 */
$message = null;


?>
<!DOCTYPE html>
<html>
<head>
    <title>TestBed for Interactive Video</title>
    <style>
body {
    margin: auto;
    text-align: center;
            font-family: "Arial";
            color: black;
            background-color: #DDDDDD;
        }

        #centerCenter {
            margin: auto;
            text-align: center;

        }

        #centerForm {
            text-align: left;
            margin: 0 auto;
            width: 500px;
            margin-top: 200px;

        }

        #centerForm div {
            margin: 20px;
            text-align: center;
        }

        #centerForm input#submitButton {
            font-size: 20px;
        }


    </style>
</head>
<body>

<div id="centerCenter">
    <div id="centerForm">
    <form method="post" action="process.php">
        <div id="text1">
    Thank you for your time! This ends our session. A token of appreciation will be given to you!
        </div>
    </form>
    </div>
</div>

</body>
</html>