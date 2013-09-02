<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 10:47 PM
 * To change this template use File | Settings | File Templates.
 */
require_once('php/config.php');
if (!isset($_COOKIE["user"])){
    $message = "Please use a username";
    header("Location: index.php?message=".$message);
    exit;
}
setcookie("trial", "0", time()+(3600*3));
$ref = $_COOKIE["user"];
?>
<!DOCTYPE html>
<html>
<head>
    <title>TestBed for Interactive Video</title>
    <script type="text/javascript" src="js/jquery-2.0.2.min.js"></script>
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
            width: 800px;
            margin-top: 50px;

        }

        #centerForm div {
            margin: 20px;
            text-align: center;
        }

        #centerForm input#submitButton {
            font-size: 20px;
        }

        #ref {
            text-align: left;
            font-size: 15px;
        }

        .hide {
            display: none !important;
        }



    </style>
</head>
<body>

<div id="centerCenter">
    <div id="centerForm">
        <div id="ref">
            REF#<?php echo $ref; ?>
        </div>
        <iframe id="myiframe" src="https://docs.google.com/forms/d/1hyX-TRX98NHLo96csXES-qYDW5Sq9hwMU3ijx25ACTU/viewform?embedded=true&entry.1587106328=<?php echo $ref;?>" width="800" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
        <div>
            <form id="myform" method="post" action="starttest.php">
                Please submit the Google form in the embedded form before clicking in the start button below
                Start Button will appear after 3 minutes...
                <input id="submitButton" type="submit" class="hide" value="Start First Test"/>
            </form>
        </div>
    </div>

</div>
<script>
    var x = null;
    var min = <?php echo $demographTime ?>;
    var time = 1000*60*min;
    var run = function() {
        x = setInterval(showButton, time);
    }

    var showButton = function(){
        $('#submitButton').removeClass('hide');
        clearInterval(x);
    }
    $(document).ready(run);
</script>

</body>
</html>