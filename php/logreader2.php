<?php
/**
 * Created by JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 6/9/13
 * Time: 10:25 PM
 * To change this template use File | Settings | File Templates.
 */





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
            width: 1200px;
            margin-top:50px;

        }

        #centerForm div {
            margin: 20px;
            text-align: center;
        }

        #centerForm input.button {
            font-size: 20px;
            float: left;
        }
        #text1 {
            text-align: left !important;
        }

        div.button {
            float: left;
            width: 48%;
            border: 1px solid black;
            background-color: transparent;
        }

        div.button:hover {
            background-color: #00FF00;
        }

        .hide {
            display: none !important;
        }

        h1 {
            font-size: 16px;
        }

        th {
            padding: 10px;
            font-size: 12px;
            border: 1px solid black;
        }

        td {
            font-size: 10px;
            border: 1px solid black;
        }

        table {
            border: 1px solid black;
        }

    </style>


    <script type="text/javascript" src="../js/jquery-2.0.2.min.js"></script>
    <script type="text/javascript" src="../js/main_viewer/general_functions.js"></script>
    <script type="text/javascript" src="../js/main_viewer/base_class.js"></script>
    <script type="text/javascript" src="js/data.js"></script>

    <script type="text/javascript" >
        var array1 = {};
        var data_array = {};
        var root = $("#centerForm");



        var loadFile = function(filename) {
            var oRequest = new XMLHttpRequest();
            var sURL = "http://"+ self.location.hostname + "/faq/requested_file.htm";

            oRequest.open("GET",filename,false);
            oRequest.setRequestHeader("Chrome",navigator.userAgent);
            oRequest.send(null)

            if (oRequest.status==200) {
                var text =  oRequest.responseText;
                //console.log(text);
                return text;
            }
            else alert("Error executing XMLHttpRequest call!");
        }

        var data_main2 = $.parseJSON(loadFile("../data/myosin_actin2.json"));
        var data_other1 = $.parseJSON(loadFile("../data/myosin_actin1_other.json"));

        var data_main1 = $.parseJSON(loadFile("../data/myosin_actin1.json"));
        var data_other2 = $.parseJSON(loadFile("../data/myosin_actin2_other.json"));

        var comment_data1 = $.parseJSON(loadFile("../data/source_comments_myosin_actin1.comments.json"));
        var comment_data2 = $.parseJSON(loadFile("../data/source_comments_myosin_actin2.comments.json"));

        function isEven(value) {
            if (value%2 == 0)
                return true;
            else
                return false;
        }

        var run = function(){
            var res = $.post('loadLogData.php');
            console.log("starting load");

            $("#centerForm").append("<h1>Total Time</h1>");
            var TotalTimeUsed = saveElement($("#centerForm"), "table", "TotalTimeUsed");
            TotalTimeUsed.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>")


            $("#centerForm").append("<h1>Accumulated Time for Video Watching: Main</h1>");
            var AccumulatedMainVideo = saveElement($("#centerForm"), "table", "AccumulatedMainVideo");
            AccumulatedMainVideo.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>")

            $("#centerForm").append("<h1>Accumulated Time for Non-Video Watching (Answering Exercise, Looking at Videos, Checking out Comments)</h1>");
            var AccumulatedNonVideo = saveElement($("#centerForm"), "table", "AccumulatedNonVideo");
            AccumulatedNonVideo.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>")

            $("#centerForm").append("<h1>Number of Extra Interactions did</h1>");
            var Interactions = saveElement($("#centerForm"), "table", "Interactions");
            Interactions.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>")

            $("#centerForm").append("<h1>Number of Discussion Threads Checked</h1>");
            var DiscussionsHovered = saveElement($("#centerForm"), "table", "DiscussionsHovered");
            DiscussionsHovered.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>")

            $("#centerForm").append("<h1>Number of Comments Checked</h1>");
            var CommentsHovered = saveElement($("#centerForm"), "table", "CommentsHovered");
            CommentsHovered.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>")

            $("#centerForm").append("<h1>Number of times Reviewed the particular Video</h1>");
            var Review = saveElement($("#centerForm"), "table", "Review");
            Review.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>");

            $("#centerForm").append("<h1>Number of times Skipped a particular part of Video</h1>");
            var Skip = saveElement($("#centerForm"), "table", "Skip");
            Skip.append("<tr><th>usernumber</th><th>InVCBLE</th><th>Udacity</th></tr>");


            res.done(function(d) {
                try {
                    array1 = $.parseJSON(d);
                    start();
                } catch (e) {
                    console.error(e.stack);
                    console.log(d);
                }
            })


            // create new dataModel
            //vD = new dataModel(root, "vData");

        }

        var start = function() {




            for (var val in array1) {
                //console.log(array1[val]);
                data_array[val] = new dataModel($("#centerForm"), val, array1[val]);

                var usernum = parseInt(val.replace("usertest", ""));
                var type = "";

                if (isEven(usernum)) {
                    //ba
                    data_array[val].run(data_main1, data_other2, "main", "other", comment_data1, comment_data2)
                } else {
                    //ab
                    data_array[val].run(data_main2, data_other1, "other", "main", comment_data1, comment_data2)
                }
                //console.log(usernum);
                //console.log(isEven(usernum));
               // break;
            }



        }



        $(document).ready(run);

    </script>
</head>
<body>

<div id="centerCenter">
    <div id="centerForm">


    </div>
</div>

</body>
</html>