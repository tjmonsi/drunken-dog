"use strict";

// other views

var vD = null;
var vUI = null;

var global_id_length = 10;
var vid_max_width = 1280;
var minBoundingBoxVal = 30;
var win_width = 0;
var win_height = 0;
var comment_time = 3;
var bodyclick = false;
var scrollData = {};
var showBInterval = null;
var showBIntervalTime = 1000*60 // *60*10;
var doneButton = null

var run = function(){

    //log("Start running", 1);
    var root = $("body");

    // create new dataModel
    vD = new dataModel(root, "vData");
    log("otherInterface:start:"+vD.user);
    vUI = new viewerUI(root, "vUI");

    addScroll(root);

    var exitsign = saveElement(root, "div", "exitSign");
    exitsign.css({"top":10, "left":20, "position": "absolute", "color": "#000000", "font-weight": "bold"});
    exitsign.append("Click on the button: 'Finish Learning' when you are done learning. Button will appear after 10 minutes")
    doneButton = new buttonClass(exitsign, "Finish Learning", "doneButton", finish);
    doneButton.element.addClass('hide');
    doneButton.element.css({"position": "static"});
    var res = $.post('returntime.php');
    res.done(function(d){
        showBInterval = setInterval(showDone, showBIntervalTime*parseFloat(d));
    });

}

var finish = function() {
    log("otherInterface:end:"+vD.user);
    vD.saveData();
    saveLog();
    window.location.href = "post_test_start.php";
}

var showDone = function() {
    doneButton.element.removeClass('hide');
    clearInterval(showBInterval);
    showBInterval = null;
}

var saveComment = function(data) {
    console.log(data);
    var res = $.post('saveToMongo.php', {"pk_key": "id", "pk_val": vD.user, "data": data, "type": "comments_others"});

    res.done(function(d){
        console.log(d);
    })
}

var saveLog = function() {
    var data = JSON.stringify({"id": vD.user,"log_other_viewer": log_data});
    console.log(data);

    var res = $.post('saveToMongo.php', {"pk_key": "id", "pk_val": vD.user, "data": data, "type": "logs"});

    res.done(function(d){
        console.log(d);
    })
}

var addScroll = function(body) {
    body.mousedown(function(e) {
        //console.log(e.target.nodeName)
        if (e.target.nodeName=="BODY") {
            bodyclick = true;
            scrollData.y = e.screenY;
            scrollData.t = e.timeStamp;
        }
    });

    body.mousemove(function(e) {
        if (bodyclick) {
            if (e.timeStamp-scrollData.t >= 1500) {
                scrollData.y= e.screenY;
            }
            var delta = (e.screenY-scrollData.y)/5
            scrollData.t = e.timeStamp;
            $('body').scrollTop($('body').scrollTop()+delta);

        }
    });

    body.mouseup(function(e){
        bodyclick=false;
    });

    body.mouseleave(function(e){
        bodyclick=false;
    })


}

$(document).ready(run);