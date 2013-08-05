"use strict";

var system = {
	general: {
		error: "Error testing/loading file",
		running: "Running ok",
		loaded: "Loaded ok",
		create_success: "Object created successfully",
		nl: "\n\n",
		line_break: "---------------------------------------------------------------",
		all_loaded: "\n\nEverything Loaded and Running... running system\n\n",
		data_loaded: "Data loaded successfully: "
	},

	general_functions: {
		name: "General functions",
		file: "./js/general/general_functions.js",
		loaded: false
	},
	general_classes: {
		name: "General classes",
		file: "./js/general/general_classes.js",
		loaded: false
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
		name: "video_Player",
		file: "./js/general/video_player.js",
		loaded: false
	},
	timeline_Player: {
		name: "timeline_Player",
		file: "./js/general/video_player_timeline.js",
		loaded: false
	},
	main_Timeline: {
		name: "main_Timeline",
		file: "./js/general/video_player_main_timeline.js",
		loaded: false
	},
	data_Model: {
		name: "data_Model",
		file: "./js/general/data_model.js",
		loaded: false
	},
	viewer_UI: {
		name: "viewer_UI",
		file: "./js/viewer/ui.js",
		loaded: false
	},
	main_Video_Player: {
		name: "main_Video_Player",
		loaded: false
	},
    embedded_objects: {
        name: "embedded_objects",
        file: "./js/general/embedded_objects.js",
        loaded: false
    },
    action_objects: {
        name: "action_objects",
        file: "./js/general/action_objects.js",
        loaded: false
    },
    context_menu: {
        name: "context_menu",
        file: "./js/general/context_menu.js",
        loaded: false
    }

}

var test_bed = function(){
	
	//tests if functions and classes were loaded
	for (var key in system) {

		// Exceptions
		if (key=="general") continue;
		//if (key=="general_classes") continue

		var name = system[key].name;

	    var t = message_tab(20, name.length, 5)

		try {
			var instance = new window[key]('test');
			var val = instance.test();

			if (val==0) {
				console.log(name+t+system.general.loaded)
			}

			instance = null;
			val = null;

		} catch (e) {
			console.error(name+t+system.general.error)
			console.error(e.stack);
			return false
			//throw new Error(e)
		}

	}

    //onYoutubePlayerReady("1");

	console.log(
		system.general.nl+
		system.general.line_break+
		system.general.all_loaded+
		system.general.line_break+
		system.general.nl)

	return true

}