"use strict";

/*var video_comment_threads = function(parent, id, data, video_id, x, y){
	this.parent = parent;
	this.id = id;
	this.data = data;
	this.video_id = video_id;
	this.x = x;
	this.y = y;

	this.element = save_element(this.parent)
}*/

var video_comment_point = function(parent, id, data, video_id, x,y, time){
	this.parent = parent;
	this.id = id;
	this.data = data;
	this.video_id = video_id;
	this.x = x
	this.y = y;
	this.comment_thread = null;
	this.time = time;
	this.comment_view_data = {};



	this.element = save_element(this.parent, "div", this.id+"_comment_pt", ['comment_pt']);
	this.element.css({"left": this.x, "top": this.y});
	this.element.append(this.data.length);

	this.element.click($.proxy(this.show_comment_threads, this));
}

video_comment_point.prototype = {
	update_comment_thread_length: function() {
		this.element.empty();
		this.element.append(this.data.length);
	},

	show_comment_threads: function(event) {
		console.log(event)
		this.comment_thread = save_element(this.parent, "div", this.id+"_comment_thread", ['comment_threads']);
		this.comment_thread.css({"left": this.x, "top": this.y});

		$.each(this.data, $.proxy(this.foreach_comment_thread, this));

		this.comment_thread.append(br())
		this.comment_thread_new = new button_UI (this.comment_thread, "New Thread", this.id+"_new_comment_thread", $.proxy(this.new_comment_thread, this));
		this.comment_thread.append(br())
		this.comment_thread.append(br())
		this.comment_thread_close = new button_UI (this.comment_thread, "Close", this.id+"_close_comment_thread", $.proxy(this.destroy_comment_thread, this));

	},

	foreach_comment_thread: function(index, value){
		this.comment_view_data[value.id] = save_element(this.comment_thread, "div", value.id, ['comment_thread']);
		this.comment_view_data[value.id].append(value.commenter+":");
		this.comment_view_data[value.id].append(br());
		this.comment_view_data[value.id].append(br());
		this.comment_view_data[value.id].append(value.comment)
		console.log(value)
	},

	update_comment_thread: function(value) {
		this.data.push(value)
		this.update_comment_thread_length();

	},

	new_comment_thread: function(event) {
		//console.log(this.data)
		this.add_new_comment_thread = new video_new_comment_thread(this.parent, this.id+"_new_comment_thread", this.video_id, this.x, this.y, this.time, this.data[0].pinID)
		this.destroy_comment_thread();
		//this.show_comment_threads();
	},

	destroy_comment_thread: function() {
		this.comment_thread.remove();
		this.comment_view_data = {};
	}







}

var video_new_comment_thread = function(parent, id, video_id, x, y, time, pinID) {
	this.parent = parent
	this.id=id;
	this.video_id=video_id;
	this.x=x;
	this.y=y;
	this.time = time;

	if (pinID==null) this.pinID = makeID(global_id_length)+"_comment_pin";
	else this.pinID = pinID

	console.log(pinID)
	this.element = save_element(this.parent, "div", this.id, ['new_comment_thread']);
	this.element.css({"left": this.x, "top": this.y})
	this.header = save_element(this.element, "div", this.id+"_header", ['new_comment_header']);
	this.header.append("Add New Comment Thread")
	this.comment_box = save_element(this.element, "textarea", this.id+"_comment", ['new_comment_box']);
	this.commenter = save_element(this.element, "input", this.id+"_commenter", ['new_commenter']);

	this.element.append(br());


	this.clear_comment = new button_UI(this.element, "Erase", this.id+"_clear_comment", $.proxy(this.reset_comment, this));
	this.ok_comment = new button_UI(this.element, "Submit", this.id+"_submit_comment", $.proxy(this.submit_comment, this))
	this.cancel_comment = new button_UI(this.element, "Cancel", this.id+"_cancel_comment", $.proxy(this.exit_comment, this))
}

video_new_comment_thread.prototype = {
	reset_comment: function(){
		this.comment_box.val('');
		this.commenter.val('');
	},

	submit_comment: function(){
		//console.log(this.comment_box.val());
		var comment_id = makeID(global_id_length)+"_comment"
		var time = this.time
		console.log(time)
		var new_comment_thread = {"commenter":this.commenter.val(), "comment": this.comment_box.val(), "id": comment_id, "thread":[], "video_id": this.video_id, "time": time, "pinID": this.pinID};
		VData.comment_threads[comment_id]=new_comment_thread;


		if (VData.trigger_comments[time.toString()]==null) {
			VData.trigger_comments[time.toString()]=[];
		}
		VData.trigger_comments[time.toString()].push({"data":new_comment_thread, "pinID": this.pinID});

		if (VUI.comment_pts[this.pinID]==null){
			console.log("it is null")
			var data = []
			data.push(new_comment_thread)
			VUI.comment_pts[this.pinID]=new video_comment_point(this.parent, this.pinID, data, this.video_id, this.x, this.y, this.time);
		} else {
			console.log(this.pinID)
			VUI.comment_pts[this.pinID].update_comment_thread(new_comment_thread);
		}


		this.destroy();
	},

	exit_comment: function(){
		this.destroy();
	},

	destroy: function(){
		this.element.remove();
		this.parent=null;
		this.data = null;
		delete this;
	}
}

var video_contextmenu = function(parent, id, video_id) {
	this.parent = parent;
	this.id = id;
	this.video_id = video_id;
	console.log(this.video_id)
	this.x = 0;
	this.y = 0;
	this.add_new_comment_thread=null;

	this.element = save_element(this.parent, "div", this.id, ['context_menu']);
	this.add_comment = save_element(this.element, "div", this.id+"_add_comment", ['context_menu_item'])
	this.add_comment.append("Add Comment");
	this.add_comment.click($.proxy(this.add_new_comment, this))

	this.see_debug = save_element(this.element, "div", this.id+"_see_debug", ['context_menu_item'])
	this.see_debug.append("Debug");
	this.see_debug.click($.proxy(this.debug, this))

	this.element.css({"left":this.x, "top":this.y})
	this.element.addClass('hide');
}

video_contextmenu.prototype = {
	setxy: function(x,y) {
		this.x=x;
		this.y=y;
		this.element.css({"left":this.x, "top":this.y})
	},

	add_new_comment: function(event){
		console.log(this.x);
		console.log(this.y);
		this.add_new_comment_thread = new video_new_comment_thread(this.parent, this.id+"_new_comment_thread", this.video_id, this.x, this.y, VUI.main_VideoPlayer.videoset[this.video_id].player.getCurrentTime())
	},

	debug: function(event){
		console.log(VData);
		console.log(VUI);
	},

	save_comments: function(event){
		console.log(VData.comment_threads);

	}

}

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
			//console.log(this.cb)
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

var video_Form = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.x = x;
	this.y = y;

	this.element = save_element(this.parent, "form", this.id, ['video_form']);
	this.element.data({"data":this.data})

	this.element.css({'left': this.x, 
					'top':this.y});
	this.element.addClass('hide');

} 

video_Form.prototype = {

}

var video_input_Box = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.x = x;
	this.y = y;

	this.element = save_element(this.parent, "input", this.id, ['input_box'], {"type": "text", "name": this.id});
	this.element.data({"data":this.data})

	this.element.css({'left': this.x, 
					'top':this.y, 
					'font-size': this.data.font_size,
					'width':this.data.width});
	this.element.addClass('hide');
}

video_input_Box.prototype = {

}

var video_text_Label = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.x = x;
	this.y = y;

	this.element = save_element(this.parent, "div", this.id, ['text_label']);
	this.element.data({"data":this.data})
	this.element.append(this.data.value)

	this.element.css({'left': this.x, 
				'top':this.y, 
				'font-size': this.data.font_size,
				'width': this.data.width});
	this.element.addClass('hide');
}

video_text_Label.prototype = {

}

var video_submit = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.x = x;
	this.y = y;

	this.button = new button_UI(this.parent, this.data.value, this.id, $.proxy(this.callback, this));
	this.element = this.button.element;
	this.element.data({"data":this.data})
	this.element.addClass("submit_button");

	this.element.css({'left': this.x, 'top':this.y});
	this.element.addClass('hide');

	this.correct_flag = true;

	this.submit_status=1;

}

video_submit.prototype = {
	callback: function() {

		var input_array = this.parent.data().data.input;

		if (this.submit_status==1) {
			
			
			$.each(input_array, $.proxy(this.return_input_data, this));

			if (this.correct_flag){

				this.element.empty();
				//console.log(this.data)
				this.element.append(this.data.value_correct)
				this.submit_status=2;
				return

			} else {
				this.element.empty();
				this.element.append(this.data.value_wrong)
				this.submit_status=3;

				this.wrong_triggers_show();
				return
			}
		} else if (this.submit_status==2) {
			if (this.data.correct.play=="current") {
				//console.log(VData.embedded_objects[this.id])
				var video_id = VData.embedded_objects[this.id].video_id
				if (video_id=="inherit") {
					var parent = VData.embedded_objects[this.id].parent
					video_id = VData.embedded_objects[parent].video_id
				}
				VUI.main_VideoPlayer.videoset[video_id].play();

			}

			$.each(input_array, $.proxy(this.enable_input, this));

			VData.timeline.passable=true;
			VData.trigger_starts[VData.gate_key].passable=VData.timeline.passable;
			this.submit_status=1;
			return;
		} else if (this.submit_status==3) {

			for (var val in this.data.wrong) {
				//console.log(this.data.wrong[val])
				for (var key in this.data.wrong[val]) {
					//console.log(key)
					VUI.embedded_objects[key].element.val(this.data.wrong[val][key]);
					//VUI.embedded_objects[key].element.prop('disabled', false);
				}
			}

			$.each(input_array, $.proxy(this.enable_input, this));

			this.element.empty();
			this.element.append(this.data.value)
			this.submit_status=1;

			this.correct_flag=true;
			return


		}

	},

	wrong_triggers_show: function() {
		for (var i in this.data.wrong_triggers_show) {
			var val = this.data.wrong_triggers_show[i];

			VUI.embedded_objects[val].element.removeClass('hide');
		}
	},

	enable_input: function(index, value) {
		//var data = VData.embedded_objects[value].data
		VUI.embedded_objects[value].element.prop('disabled', false);

	},


	return_input_data: function(index, value) {
		var data = VData.embedded_objects[value].data

		if (data.correct==null) {
			//collect data here
			return
		}

		var input_value = VUI.embedded_objects[value].element.val();

		VUI.embedded_objects[value].element.prop('disabled', true);

		var correct = data.correct;
		if (data.input_type=="number") {

			// sanitize input_value
			input_value = eval(input_value);
			correct = parseFloat(correct)
		} 

		if (input_value!=correct) {
			this.correct_flag=false;
		} 

	}


}

var video_hint_trigger = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.x = x;
	this.y = y;

	this.button = new button_UI(this.parent, "hint", this.id, $.proxy(this.callback, this))
	this.element = this.button.element;
	this.element.data({"data":this.data})
	this.element.addClass("hint_button");

	this.element.css({'left': this.x, 'top':this.y});
	this.element.addClass('hide');

	this.currentShow=false;
}

video_hint_trigger.prototype = {
	callback: function() {
		if (this.currentShow) {
			$.each(this.data.show, $.proxy(this.hide_elements, this))
			this.currentShow=false;
		}
		else {
			$.each(this.data.show, $.proxy(this.show_elements, this))
			this.currentShow=true;
		}


	},

	show_elements: function(index, value) {
		VUI.embedded_objects[value].element.removeClass('hide')
	},

	hide_elements: function(index, value) {
		VUI.embedded_objects[value].element.addClass('hide')
	}
}

var video_sub_video = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.video_player_id=makeID(global_id_length)
	this.x = x;
	this.y = y;

	this.element = save_element(this.parent, "div", this.id, ['sub_video'])
	console.log(this.data)
	this.video = new video_Player(this.element, this.data.data, this.video_player_id, this.data.width)
	VData.videoplayers[this.video.id]=this.video;
	this.video.set_start_end(this.data.start, this.data.end);

	this.element.data({"data":this.data})

	this.element.css({'left': this.x, 'top':this.y});

	this.element.addClass('hide');
}

video_sub_video.prototype = {

}

var video_button = function(parent, data, id, x, y) {
	this.parent = parent;
	this.data = data;
	this.id = id;
	this.x = x;
	this.y = y;

	this.button = new button_UI(this.parent, this.data.value, this.id, this.callback)
	this.element = this.button.element;
	this.element.data({"data":this.data})	
	this.element.addClass("video_button");

	this.element.css({'left': this.x, 'top':this.y});

	this.element.addClass('hide');
}

video_button.prototype = {
	callback: function() {

	}
}


var main_VideoPlayer = function(parent){
	this.parent = parent;
	this.element = save_element(this.parent, "div", "main_VideoPlayer");
	this.videoset = {};
	this.init();

}

main_VideoPlayer.prototype = {
	init: function() {
		for (var i=0; i<VData.timeline.timeline.length; i++) {
			if (this.videoset[VData.timeline.timeline[i]]==null) {
				this.videoset[VData.timeline.timeline[i]]=new video_Player(this.element, VData.scene_objects[VData.timeline.timeline[i]].data, VData.timeline.timeline[i], 1280, true);
				VData.videoplayers[this.videoset[VData.timeline.timeline[i]].id]=this.videoset[VData.timeline.timeline[i]]
				this.videoset[VData.timeline.timeline[i]].on_back();
			} 
		}
		//console.log(VData.timeline.timeline)
		this.videoset[VData.viewer_data.start].on_show();
	}
}



var viewer_UI = function(parent) {
	this.parent = parent;
	this.element = save_element(this.parent, "div", "main_Viewer")

	this.main_VideoPlayer = null;
	this.embedded_objects = {};
	this.comment_threads = {};
	this.comment_pts = {};

	this.init();

}

viewer_UI.prototype = {
	init: function() {
		this.main_VideoPlayer = new main_VideoPlayer(this.element);
		//VData.create_embed_interfaces();
	}

}