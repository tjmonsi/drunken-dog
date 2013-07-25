"use strict";

var VControl = null;
var VData = null;
var VUI = null;
//var tempData = null;
var global_id_length = 10;
var win_width = 0;
var win_height = 0;
var debug = true;

var run = function() {
	var vroot = $("body");
	VControl = new viewer_Control(vroot);
	VData = new viewer_Data(vroot);
	//console.log(VData)
	Loader.init();
	//console.log(VData)
	VUI = new viewer_UI(vroot);
	VData.create_embed_interfaces();

	console.log(VData.scene_objects);
	console.log(VData.embedded_objects);
	console.log(VData.trigger_starts)
	console.log(VData.trigger_ends)

}

$(document).ready(run);
$(document).resize(updateSize);
$(window).resize(updateSize);