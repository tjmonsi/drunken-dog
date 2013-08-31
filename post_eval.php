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
            REF# <? echo $ref; ?><br/>
            SYS# <? echo $env; ?><br/>
        </div>
        <iframe id="myiframe" src="https://docs.google.com/forms/d/1-tEJQck5SBTBohABmnNnk4Yyl3-GFHRoJ9rySv3L6PE/viewform?entry.1808686863=<?echo $ref;?>&entry.590515155=<?echo $env;?>&embedded=true" width="800" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
        <div>
            <form id="myform" method="post" action="endsession.php">
                Please submit the Google form in the embedded form before clicking in the start button below
                Start Button will appear after 5 minutes...
                <input id="submitButton" type="submit" class="hide" value="End Interface Evaluation <? echo $trial?>"/>
            </form>
        </div>
    </div>

</div>
<script>
    var x = null;
    var min = <?echo $pretestTime; ?>;
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