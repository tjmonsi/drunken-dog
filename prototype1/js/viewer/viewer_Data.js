"use strict";

var main_Data_Timeline = function() {
	this.init();
	this.timelength = 0;
	this.timeline_timepts= [];
	this.timeline_index = {};
	this.timeline = [];
	this.currentTime=0;
	this.passable = true;
	this.gate_key = null
}

main_Data_Timeline.prototype = {
	init: function() {

	},

	load_time_length: function() {
		$.each(this.timeline, $.proxy(this.add_to_length, this))
		console.log(this.timelength);
		//console.log(this.timeline_start);
		console.log(this.timeline_index);
		console.log(this.timeline);
	},

	add_to_length: function(index, value) {

		this.timeline_timepts[index]={ "timelength_start":this.timelength, "video_start": VData.scene_objects[value].start, "video_end": VData.scene_objects[value].end};
		this.timeline_index[value]=index;
		this.timelength+=(this.timeline_timepts[index].video_end-this.timeline_timepts[index].video_start);
	},

	update_timeline: function(index, time) {
		var currentTime = time-this.timeline_timepts[index].video_start;
		this.currentTime = currentTime+this.timeline_timepts[index].timelength_start;

		for (var key in VData.trigger_starts) {
			var trigger_time = parseFloat(key);


			//console.log(trigger_time)
			if ((time<=trigger_time) && (time+0.25>=trigger_time)) {
				if (VData.trigger_starts[key].pause) {
					VUI.main_VideoPlayer.videoset[VData.timeline.timeline[index]].pause();
					this.passable=VData.trigger_starts[key].passable;
					this.gate_key=key;
				}
				$.each(VData.trigger_starts[key].data, $.proxy(this.check_initial_show, this))
			}
		}

		for (var key in VData.trigger_ends) {
			var trigger_time = parseFloat(key);

			if (time>=trigger_time) {
				//console.log(trigger_time)
				$.each(VData.trigger_ends[key], $.proxy(this.hide_elements, this))

			}
		}

		for (var key in VData.trigger_comments){
			var trigger_time = parseFloat(key);
			var arr = VData.trigger_comments[key]

			for (var i in arr) {

				var pinID = arr[i].pinID
				if ((trigger_time<=time) && (trigger_time+5>=time)) {
				
					VUI.comment_pts[pinID].element.removeClass('hide')

				} else {

					VUI.comment_pts[pinID].element.addClass('hide')
				}
			}


		}
		//console.log(this.currentTime);
	},

	check_initial_show: function(index, value) {
		var initial_show = VData.embedded_objects[value].show;

		try {
			if (initial_show) {
				VUI.embedded_objects[value].element.removeClass('hide');
			}
		} catch (e) {

		} 
	},

	hide_elements: function(index, value) {
		try {
			//console.log(value)
			VUI.embedded_objects[value].element.addClass('hide');
		} catch (e) {

		}
	}






}

var viewer_Data = function(parent) {
	this.parent = parent;
	this.videoplayers = {};
	this.scene_objects = {};
	this.embedded_objects = {};
	this.trigger_starts = {};
	this.trigger_ends = {};
	this.assets = {};
	this.viewer_data = {};
	this.init();
	//this.main_timeline = [];
	this.timeline = new main_Data_Timeline();

	this.trigger_comments = {};
	this.comment_threads = {};

}

viewer_Data.prototype = {
	init: function() {
		//console.log(this.videoplayers)
	},

	load: function(data) {
		this.viewer_data['name']=data.iv.name
		this.viewer_data['id']=data.iv.id
		this.viewer_data['start']=data.iv.start
		var main_data = data.iv.data;

		$.each(main_data.scene_objects, $.proxy(this.add_to_scene, this));
		$.each(main_data.embedded_objects, $.proxy(this.add_to_embed, this));
		$.each(this.embedded_objects, $.proxy(this.clean_inherit, this));
		$.each(this.embedded_objects, $.proxy(this.get_triggers, this))

		this.load_to_main_timeline();
		//for (var i=0; i<main_data.scene_objects.length; i++){
		//	this.scene_objects[main_data.scene_objects[i].id]
		//}
		//this.scene_objects = main_data.scene_objects;


		
	},

	add_to_scene: function(index, value) {
		//console.log(value);
		this.scene_objects[value.id] = value;
	},

	add_to_embed: function(index, value) {
		this.embedded_objects[value.id] = value;
	},

	clean_inherit: function(index, value) {
		var parent_val = this.embedded_objects[value.parent];
		if (value.start=="inherit"){
			this.embedded_objects[value.id].start = parent_val.start
		}
		if (value.pause=="inherit"){
			this.embedded_objects[value.id].pause = parent_val.pause
		}
		if (value.end=="inherit"){
			this.embedded_objects[value.id].end = parent_val.end
		}
		if (value.show=="inherit"){
			this.embedded_objects[value.id].show = parent_val.show
		}
		if (value.video_id=="inherit"){
			this.embedded_objects[value.id].video_id = parent_val.video_id
		}
		if (value.passable=="inherit"){
			this.embedded_objects[value.id].passable = parent_val.passable
		}
	},

	get_triggers: function(index, value) {

		if (value.start!=null) {
			if (this.trigger_starts[value.start.toString()]==null){
				var val = {};
				val.pause=value.pause;
				val.passable = value.passable;
				val.data = [];
				val.data.push(value.id);
				this.trigger_starts[value.start.toString()]=val;
			} else {
				var pause = this.trigger_starts[value.start.toString()].pause
				if (!pause)
					this.trigger_starts[value.start.toString()].pause=value.pause;
				var passable=this.trigger_starts[value.start.toString()].passable
				if (passable)
					this.trigger_starts[value.start.toString()].passable=value.passable;
				this.trigger_starts[value.start.toString()].data.push(value.id);
			}


			/*if (value.start!="inherit") {
				if (this.trigger_starts[value.start.toString()]==null){
					var val = {};
					val.pause=value.pause;
					val.passable = value.passable;
					val.data = [];
					val.data.push(value.id);
					this.trigger_starts[value.start.toString()]=val;
				} else {
					if (!this.trigger_starts[value.start.toString()].pause)
						this.trigger_starts[value.start.toString()].pause=value.pause;
					var passable=this.trigger_starts[value.start.toString()].passable
					if ((passable!='inherit') && (passable))
						this.trigger_starts[value.start.toString()].passable=value.passable;
					this.trigger_starts[value.start.toString()].data.push(value.id);
				}
			} else {
				if (!this.trigger_starts[this.embedded_objects[value.parent].start.toString()].pause)
					this.trigger_starts[this.embedded_objects[value.parent].start.toString()].pause=value.pause;
				var passable = this.trigger_starts[this.embedded_objects[value.parent].start.toString()].passable
				if ((passable!='inherit') && (passable))
					this.trigger_starts[this.embedded_objects[value.parent].start.toString()].passable=value.passable;
				this.trigger_starts[this.embedded_objects[value.parent].start.toString()].data.push(value.id);
			}*/

		}	

		if (value.end!=null) {
			if (value.end!="inherit") {	
				if (this.trigger_ends[value.end.toString()]==null){
						this.trigger_ends[value.end.toString()]=[];
				}
					this.trigger_ends[value.end.toString()].push(value.id);
			} else {
			var end = this.embedded_objects[value.parent].end
				if (end!=null) {
					this.trigger_ends[end.toString()].push(value.id);
				} else {
					end = this.embedded_objects[value.parent].start+0.1
					if (this.trigger_ends[end.toString()]==null) {
						this.trigger_ends[end.toString()]=[];
					}
					this.trigger_ends[end.toString()].push(value.id);
				}

			}
		} else {
			//console.log(value)
			if (value.start!="inherit") {
				if (value.start!=null) {
					var start=value.start+0.1;
					if (this.trigger_ends[start.toString()]==null){
						this.trigger_ends[start.toString()]=[];
					}
					this.trigger_ends[start.toString()].push(value.id);
				}
			} else {
				var end = this.embedded_objects[value.parent].start
				
				if (end!=null) {
					end+=0.1;
					this.trigger_ends[end.toString()].push(value.id);
				}
			}
		}
	},

	create_embed_interfaces: function() {
		for (var key in this.embedded_objects) {

			var value = this.embedded_objects[key];
			//console.log(value);
			if (value.data.type=="form") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_Form(parent, value.data, value.id, value.x, value.y)
			} else if (value.data.type=="input_box") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_input_Box(parent, value.data, value.id, value.x, value.y)
			} else if (value.data.type=="text_label") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_text_Label(parent, value.data, value.id, value.x, value.y)
			} else if (value.data.type=="submit") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_submit(parent, value.data, value.id, value.x, value.y)
			} else if (value.data.type=="hint_trigger") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_hint_trigger(parent, value.data, value.id, value.x, value.y)
			} else if (value.data.type=="video") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_sub_video(parent, value.data, value.id, value.x, value.y)
			} else if (value.data.type=="button") {
				parent = this.embed_object_parent(value);
				VUI.embedded_objects[value.id]= new video_button(parent, value.data, value.id, value.x, value.y)
			}
		}
	},

	embed_object_parent: function(value){
		if (value.parent==null) {

			return VUI.main_VideoPlayer.videoset[value.video_id].player_area
		} else {
			return VUI.embedded_objects[value.parent].element;
		}
	},

	load_to_main_timeline: function() {
		var i=0;
		this.timeline.timeline[i] = this.viewer_data.start;
		//console.log((this.scene_objects[this.main_timeline[i]]))

		var next = (this.scene_objects[this.timeline.timeline[i]]).next;
		var temp_next = (this.scene_objects[this.timeline.timeline[i]]).temp_next

		while ((next!=null) || (temp_next!=null)){

			if (temp_next!=null) {
				this.timeline.timeline[i+1]=temp_next
			} else {
				this.timeline.timeline[i+1]=next
			}
			i++;

			next = (this.scene_objects[this.timeline.timeline[i]]).next;
			temp_next = (this.scene_objects[this.timeline.timeline[i]]).temp_next

		}


		//console.log(this.main_timeline);
		
		this.timeline.load_time_length();

	} 

}