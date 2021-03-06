<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 31/8/13
 * Time: 10:47 PM
 * To change this template use File | Settings | File Templates.
 */

if (!isset($_COOKIE["user"])){
    $message = "Please use a username";
    header("Location: index.php?message=".$message);
    exit;
}
if (!isset($_COOKIE["env"])){
    $message = "There's no parameter for this test...";
    header("Location: index.php?message=".$message);
    exit;
}
if (!isset($_COOKIE["trial"])){
    $message = "There's no trial parameter for this test...";
    header("Location: index.php?message=".$message);
    exit;
}
$ref = $_COOKIE["user"];
$env = $_COOKIE["env"];
$trial = $_COOKIE["trial"];

if (strcmp($trial, "1")==0) {
    $src = "https://docs.google.com/forms/d/1_8thYlS2p7CeF8T-fW3cRYAkl_UCiDEXD-Uf9O-I6Io/viewform?entry.1038013254=".$ref."&entry.1874962675=".$env."&embedded=true";

} elseif (strcmp($trial, "2")==0) {
    $src = "https://docs.google.com/forms/d/1jHIZblObCza81Eagvx_aGGeCxZU3Vb4Kkr2wxT5FfKM/viewform?entry.2054494146=".$ref."&entry.1212956983=".$env."&embedded=true";
} else {
    $message = $trial." There's no trial parameter for this test...";
    header("Location: index.php?message=".$message);
    exit;
}
require_once('php/config.php');
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
            margin-top: 100px;

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
            REF# <?php echo $ref; ?><br/>
            SYS# <?php echo $env; ?><br/>
        </div>
        <iframe id="myiframe" src="<?php echo $src;?>" width="800" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
        <div>
            <form id="myform" method="post" action="post_eval_start.php">
                Please submit the Google form in the embedded form before clicking in the start button below
                Start Button will appear after 5 minutes...
                <input id="submitButton" type="submit" class="hide" value="Start Interface Evaluation <?php echo $trial?>"/>
            </form>
        </div>
    </div>

</div>
<script>
    var x = null;
    var min = <?php echo $pretestTime; ?>;
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