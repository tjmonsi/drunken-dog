"use strict";

var vData = null;
var vUI = null;

var global_id_length = 10;
var win_width = 0;
var win_height = 0;
var debug = true;
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
}

$(document).ready(run);