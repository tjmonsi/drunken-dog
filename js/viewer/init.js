"use strict";

var vData = null;
var vUI = null;

var global_id_length = 10;
var yt_length = 11;
var win_width = 0;
var win_height = 0;
var debug = false;
var debug2 = false;
var test_run = false;

var run = function(){

	// test loads first
	if (test_bed()) {

		var root = $("body");
		
		vData = new data_Model(root, "vData");
		vUI = new viewer_UI(root, "main_Viewer");

	} else {
		console.error("Shutting down program")
	}


    console.log(vData)
}

$(document).ready(run);