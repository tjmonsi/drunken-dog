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


var run = function(){

    //log("Start running", 1);
    var root = $("body");

    // create new dataModel
    vD = new dataModel(root, "vData");

    vUI = new viewerUI(root, "vUI");

    addScroll(root);

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