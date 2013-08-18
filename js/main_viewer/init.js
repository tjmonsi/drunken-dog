"use strict";

var vD = null;
var vUI = null;

var global_id_length = 10;
var vid_max_width = 1280;
var min_bounding_box_val = 30;
var win_width = 0;
var win_height = 0;
var comment_time = 3;

var run = function(){

    log("Start running", 1);
    var root = $("body");

    // create new dataModel
    vD = new dataModel(root, "vData");

    vUI = new viewerUI(root, "vUI");

}

$(document).ready(run);