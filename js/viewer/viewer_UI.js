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
					parent = VData.embedded_objects[this.id].parent
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

	this.init();

}

viewer_UI.prototype = {
	init: function() {
		this.main_VideoPlayer = new main_VideoPlayer(this.element);
		//VData.create_embed_interfaces();
	}

}