"use strict";

/*---------------------- button_UI -------------------------*/

var button_UI = function(parent, label, id, callback, color, mousein, mouseout) {
	this.parent = parent;
	this.label = label;

	this.mousein_flag = true;
	this.mouseout_flag = true;

	if (typeof(id)==='undefined') id="";
	if (typeof(color)==='undefined') color="black";
	if (typeof(mousein)==='undefined') this.mousein_flag=false;
	if (typeof(mouseout)==='undefined') this.mouseout_flag=false;

	this.id = id;
	
	this.cb = callback;
	this.mousein = mousein;
	this.mouseout = mouseout;

	this.color = color;

	this.element = save_element(this.parent, "a", this.id, ["button", this.color], {"href":"#"});
	this.element.append(this.label);
	//this.element.data(this.cb)

	this.element.click($.proxy(this.on_click, this));
}

button_UI.prototype = {
	on_click: function(event){
		try {
			this.cb();
		} catch (err) {
			throw new Error(err);
		}
    },

    on_mouse_in: function(event){
    	if (this.mousein_flag) this.mousein();
    },

    on_mouse_out: function(event){
    	if (this.mouseout_flag) this.mouseout();
    },

    update_label: function(new_label){
    	this.label = new_label;
    	this.element.empty();
    	this.element.append(this.label);
    }
}

/*---------------------- Video_Scene_Object------------------------*/
var Video_Scene_Object = function (parent, data, id, x,y) {
	this.parent = parent;
	this.data = data;
	this.element = save_element(this.parent, "div", id, ['video_scene_object']);
	this.element.data({"type": "video", "data": this.data});

	var random_id = makeID(global_id_length);

	this.videoplayer = new video_Player(this.element, this.data, random_id, 240);
	Data.videoplayers[this.videoplayer.id]=this.videoplayer;

	this.data_viewer = save_element(this.element, "div", id+'_video_scene_data_view', ['video_scene_data']);
	this.data_viewer.append(this.data.title)

	this.data_viewer.append(br());

	this.add_to_asset = save_element(this.data_viewer, 'a', id+'_delete_scene', ['ui-icon', 'ui-icon-trash'], {'href':'#', 'title':'Delete Scene'});
	this.add_to_asset.append('Delete Scene');

    this.add_to_asset.click($.proxy(this.on_click, this));

    this.element.draggable(this.object_draggable);

    this.element.css({"left": x, "top": y});

	this.init();
}

Video_Scene_Object.prototype = {
	on_click: function(e) {

	},

	init: function() {

	},

	object_draggable: {
		cancel: 'object, a.ui-icon, div.scrubber, div.timeline',
		cursor: 'move',
		zIndex: 100000
	},

	destroy: function() {
		this.element.remove();
		this.parent=null;
		this.data = null;
		delete this;		
	}
}


/*---------------------- Video_Asset_Object------------------------*/

var Video_Asset_Object = function (parent, data, id) {
	this.parent = parent;
	this.data = data;
	this.element = save_element(this.parent, "div", id, ['video_asset_object']);
	this.element.data({"type": "video", "data": this.data});

	var random_id = makeID(global_id_length);

	this.videoplayer = new video_Player(this.element, this.data, random_id, 240);
	Data.videoplayers[this.videoplayer.id]=this.videoplayer;

	console.log(Data.videoplayers[this.videoplayer.id])

	this.data_viewer = save_element(this.element, "div", id+'_video_asset_data_view', ['video_asset_data']);
	this.data_viewer.append(this.data.title)

	this.data_viewer.append(br());

	this.add_to_asset = save_element(this.data_viewer, 'a', id+'_delete_video', ['ui-icon', 'ui-icon-trash'], {'href':'#', 'title':'Delete Video'});
	this.add_to_asset.append('Delete Video');

    this.add_to_asset.click($.proxy(this.on_click, this));

    this.element.draggable(this.object_draggable);

	this.init();
}

Video_Asset_Object.prototype = {
	on_click: function(e) {

	},

	init: function() {

	},

	object_draggable: {
		cancel: 'object, a.ui-icon, div.scrubber, div.timeline',
		revert: 'invalid',
		helper: 'clone',
		cursor: 'move',
		zIndex: 100000,
		start: function() {
			UI.asset_bar.asset_list_view.css({"overflow":"visible"});
		},
		drag: function() {

		},
		stop: function(){
			UI.asset_bar.asset_list_view.css({"overflow":"auto"});
		}
	},

	destroy: function() {
		this.element.remove();
		this.parent=null;
		this.data = null;
		delete this;		
	}
}



/*---------------------- new_Asset_Object -------------------------*/

var new_Asset_Object = function (parent, data, id) {
	this.parent = parent;
	data.subtype = "youtube";
	this.data = data;
	this.element = save_element(this.parent, "div", id, ['new_asset_object']);
	this.element.data({"type": "video", "data": this.data});

	var random_id = makeID(global_id_length);

	this.videoplayer = new video_Player(this.element, this.data, random_id, 240);
	Data.videoplayers[this.videoplayer.id]=this.videoplayer;

	this.data_viewer = save_element(this.element, "div", id+'_data_view', ['new_asset_object_data']);
	this.data_viewer.append(this.data.title)

	this.data_viewer.append(br());

	this.add_to_asset = save_element(this.data_viewer, 'a', id+'_add_to_asset', ['ui-icon', 'ui-icon-plusthick'], {'href':'#', 'title':'Add to Asset'});
	this.add_to_asset.append('Add to Asset');

	/*<a href="images/high_tatras4.jpg" title="View larger image" class="ui-icon ui-icon-zoomin">View larger</a>
    <a href="link/to/trash/script/when/we/have/js/off" title="Delete this image" class="ui-icon ui-icon-trash">Delete image</a>*/

    this.add_to_asset.click($.proxy(this.on_click, this));

    this.element.draggable(this.object_draggable);

	this.init();

}

new_Asset_Object.prototype = {
	on_click: function(e) {
		Control.send_to_asset(this.element);
	},

	init: function() {

	},

	object_draggable: {
		cancel: 'object, a.ui-icon, div.scrubber, div.timeline',
		revert: 'invalid',
		helper: 'clone',
		cursor: 'move',
		zIndex: 100000

	},

	destroy: function() {
		this.element.remove();
		this.parent=null;
		this.data = null;
		delete this;		
	}
}

/*---------------------- new_Asset_Window -------------------------*/

var new_Asset_Window = function (parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "new_Asset_Window");

	this.handler = save_element(this.element, "div", "new_Asset_Window_handler", ["window_handler"]);
	this.handler.append("New Asset");
	this.handler.disableSelection();

	this.top_exit = save_element(this.element, "div", "new_Asset_Window_window_exit", ["window_exit"]);
	this.top_exit_button = save_element(this.top_exit, "a", "new_Asset_Window_window_exit_button", ["ui-icon", 'ui-icon-circle-close'], {'href':'#', 'title':'Close Window'});
	this.top_exit_button.append("Close WIndow");

	this.top_exit_button.click($.proxy(this.on_click_close, this));

	this.content_area = save_element(this.element, "div", "new_Asset_Window_content", ["window_content"]);
	
	this.search_area = save_element(this.content_area, "div", "new_Asset_Window_Search");

	/* Add Previous and Next here */

	this.youtube_list = save_element(this.content_area, "div", "new_Asset_Window_YT_List");

	this.youtube_list.cview = save_element(this.youtube_list, "div", "new_Asset_Window_content_inner", ["pad10"]);

	this.element.draggable(this.window_drag);
	this.element.draggable("option", "handle", this.handler.selector);

	this.containerlist = [];

	this.data = null;

	this.init();
}

new_Asset_Window.prototype = {
	init: function(){
		this.list_index=1;
		this.load_page=6;
		Control.call_youtube_list(this.list_index, this.load_page);
		//console.log(this.data);
	},

	on_click_close: function(e){
		this.destroy();
	},

	new_data: function(data) {
		console.log(data)
		$.each(data.data.items, $.proxy(this.add_list, this));
	},

	add_list: function(i, data) {
		if (typeof(data.player) !== 'undefined' && typeof(data.title) !== 'undefined') {
            //dataContainer.append("<li><a href = "+val.player.default+" target = '_blank'>"+val.title+"</a></li>");
            var object = new new_Asset_Object(this.youtube_list.cview, data, data.id+"_new_asset_object");
            var id = object.videoplayer.id;
            this.containerlist.push(id);

        }

        console.log(Data.videoplayers.length)
	},

	renew_list: function() {
		this.youtube_list.empty();
	},

	window_drag: {
		containment: 'parent',
		handle: null,
		cursor: 'move',
		start: function(){
			//console.log(UI.new_asset_window.handler.selector)
		},
		drag: function(){

		},
		stop: function(){

		}
	},

	destroy: function() {
		this.element.remove();
		while (this.containerlist.length!=0){
			var id = this.containerlist.pop();
			delete Data.videoplayers[id];
		}
		this.parent=null;
		console.log(Data.videoplayers.length)
		//delete this;
		//console.log(UI.new_asset_window);
		UI.new_asset_window=null;
	}
}

/*---------------------- tab_Bar_UI -------------------------*/

var tab_Bar_UI = function(parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "tab_Bar")

	// initialize tab_Bar
	this.init();
}

tab_Bar_UI.prototype = {
	init: function() {

	}
}

/*---------------------- tool_Bar_UI -------------------------*/

var tool_Bar_UI = function(parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "tool_Bar")

	// inializie tool_Bar
	this.init();
}

tool_Bar_UI.prototype = {
	init: function() {

	}
}

/*---------------------- asset_Bar_UI -------------------------*/

var asset_Bar_UI = function(parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "asset_Bar")

	console.log(this.element.height());

	this.asset_bar_top_view = save_element(this.element, "div", "asset_Bar_top");

	console.log(this.asset_bar_top_view.height());

	this.asset_list_view = save_element(this.element, "div", "asset_Bar_list");
	this.asset_list_view.css({"overflow":"auto"});

	this.asset_bar_list_resize();

	this.asset_bar_top_view.cview = save_element(this.asset_bar_top_view, "div", "asset_Bar_top_content", ["pad10"]);
	this.asset_list_view.cview = save_element(this.asset_list_view, "div", "asset_Bar_list_content", ["pad10"]);

	this.asset_bar_top_label = save_element(this.asset_bar_top_view.cview, "span", "asset_bar_top_label", ["label", "left"]);
	this.asset_bar_top_label.append("Asset");

	this.add_asset = new button_UI(this.asset_bar_top_view.cview, "Add", "add_asset", Control.call_new_asset_window)
	this.add_asset.element.addClass("right");

	this.element.droppable(this.droppable_area)
	//this.add_asset = save_element(this.asset_bar_top_view, "a", )

	// inializie tool_Bar
	this.init();
}

asset_Bar_UI.prototype = {
	init: function() {



	},

	asset_bar_list_resize: function() {
		var height = this.element.height()-this.asset_bar_top_view.height();
		this.asset_list_view.css({"height":height})
	},

	droppable_area: {
		accept: 'div#new_Asset_Window_content_inner > div.new_asset_object',
		activeClass: "ui-state-highlight",
		drop: function(event, ui) {
			//console.log(event);
			///console.log(ui);
			Control.send_to_asset(ui);
		}
	}
}

/*---------------------- workarea_UI -------------------------*/

var workArea_UI = function(parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "workArea")

	this.element.droppable(this.droppable_area);
	// inializie tool_Bar
	this.init();
}

workArea_UI.prototype = {
	init: function() {

	},

	droppable_area: {
		accept: 'div#new_Asset_Window_content_inner > div.new_asset_object, div#asset_Bar_list_content > div.video_asset_object',
		activeClass: "ui-state-highlight",
		drop: function(event, ui) {
			//console.log(event);
			///console.log(ui);
			Control.send_to_workspace(event, ui);
		}

	}
}

/*---------------------- main_toolkit_UI -------------------------*/

var toolkit_UI = function(parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "main_toolkit_UI")

	this.tab_bar = null;
	this.tool_bar = null;
	this.asset_bar = null;
	this.workArea = null;

	// start init
	this.init();
}

toolkit_UI.prototype = {
	init: function() {

		// initialize tab_bar
		this.tab_bar = new tab_Bar_UI(this.element);

		// initialize tool_bar
		this.tool_bar = new tool_Bar_UI(this.element);

		// initialize asset_bar
		this.asset_bar = new asset_Bar_UI(this.element);

		// initialize workarea
		this.workArea = new workArea_UI(this.element);
	}
}