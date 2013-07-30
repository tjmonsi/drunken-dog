"use strict";

var console_messages = {
	general: {
		error: "Error testing/loading",
		loaded: "Loaded and running ok",
		create_success: "Object created successfully",
		nl: "\n\n",
		line_break: "---------------------------------------------------------------",
		all_loaded: "\n\nEverything Loaded and Running... running system\n\n"
	},

	general_functions: {
		name: "General functions"
	},
	button_Class: {
		name: "button_Class"
	},
	button_Icon_Class: {
		name: "button_Icon_Class"
	},
	window_Class: {
		name: "window_Class"
	},
	video_Player: {
		name: "video_Player"
	},
	timeline_Player: {
		name: "timeline_Player"
	},
	main_Timeline: {
		name: "main_Timeline"
	},
	data_Model: {
		name: "data_Model"
	},
	viewer_UI: {
		name: "viewer_UI"
	},
	main_Video_Player: {
		name: "main_Video_Player"
	}

}

var test_bed = function(){
	
	//tests if functions and classes were loaded
	for (var key in console_messages) {

		// Exceptions
		if (key=="general") continue;
		//if (key=="general_functions") continue

		var name = console_messages[key].name;
		var t = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"

		for (var i=0; i<(name.length/5)+1; i++){
			t=t.substring(0,t.length-1)
		}

		try {
			var instance = new window[key]('test');
			var val = instance.test();

			if (val==0) {
				console.log(name+t+console_messages.general.loaded)
			}

			instance = null;
			val = null;

		} catch (e) {
			console.error(name+t+console_messages.general.error)
			console.error(e.stack);
			return false
			//throw new Error(e)
		}

	}

	console.log(
		console_messages.general.nl+
		console_messages.general.line_break+
		console_messages.general.all_loaded+
		console_messages.general.line_break+
		console_messages.general.nl)

	return true

}