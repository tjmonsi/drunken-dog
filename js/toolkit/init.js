"use strict";

var Control = null;
var Data = null;
var UI = null;
var global_id_length = 10;
var win_width = 0;
var win_height = 0;

var run = function() {

	var root = $("body");
	Control = new toolkit_Control(root);
	Data = new toolkit_Data(root);
	UI = new toolkit_UI(root);
}

//window.addEventListener('load', run)
$(document).ready(run);
$(document).resize(updateSize);
$(window).resize(updateSize);
