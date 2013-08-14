"use strict";



var vData = null;
var vUI = null;

var global_id_length = 10;
var yt_length = 11;
var vid_max_width = 1280;
var min_bounding_box_val = 30;
var win_width = 0;
var win_height = 0;
var debug = false;
var debug2 = false;
var test_run = false;
var comment_time = 3;

var run = function(){

	// test loads first
	if (test_bed()) {

		var root = $("body");

		vData = new data_Model(root, "vData");
    //    onYouTubePlayerReady
    //if (onYoutubePlayerReady("test")) console.log("yT is loaded")
    vUI = new viewer_UI(root, "main_Viewer");

	} else {
		console.error("Shutting down program")
	}


    console.log(vData)
    //console.log(onYoutubePlayerReady)
}

$(document).ready(run);