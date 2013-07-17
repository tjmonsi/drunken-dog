"use strict";

var Control = null;
var Data = null;
var UI = null;
var global_id_length = 10;

var run = function() {
	var root = $("body");
	Control = new toolkit_Control(root);
	Data = new toolkit_Data(root);
	UI = new toolkit_UI(root);
}

window.addEventListener('load', run)

