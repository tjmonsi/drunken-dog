"use strict";

/*---------  Main Time Line ------------- */
var main_Timeline = function(parent, id) {
	this.parent = parent;
	this.id = id;
	this.classType = "main_Timeline"
	//this.timelength = 0;
	//this.timeline_timepts= [];
	//this.timeline_index = {};
	this.timeline = [];
	//this.currentTime=0;
	//this.passable = true;
	//this.gate_key = null

	this.start();
}

main_Timeline.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

		if (debug) creation_success(this.classType, this.id)
	},

	test: function(){
        var test_code = 0;

        if (test_run) {
            
        }

        return test_code;
    },

    destroy: function() {
        for (var key in this) {
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        //add more here


        // this should be last
        vData.delete_instance(this.id);
    },    

	load_time_length: function() {
		//$.each(this.timeline, $.proxy(this.add_to_length, this))
		//console.log(this.timelength);
		//console.log(this.timeline_start);
		//console.log(this.timeline_index);
		//console.log(this.timeline);
	},

	add_to_length: function(index, value) {

		/*this.timeline_timepts[index]={ "timelength_start":this.timelength, "video_start": VData.scene_objects[value].start, "video_end": VData.scene_objects[value].end};
		this.timeline_index[value]=index;
		this.timelength+=(this.timeline_timepts[index].video_end-this.timeline_timepts[index].video_start);*/
	},

	update_timeline: function(video_id, time) {
		//var currentTime = time-this.timeline_timepts[index].video_start;
		//this.currentTime = currentTime+this.timeline_timepts[index].timelength_start;

		/*
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


		}*/
		//console.log(this.currentTime);
	},

	check_initial_show: function(index, value) {
		/*var initial_show = VData.embedded_objects[value].show;

		try {
			if (initial_show) {
				VUI.embedded_objects[value].element.removeClass('hide');
			}
		} catch (e) {

		} */
	},

	hide_elements: function(index, value) {
		/*try {
			//console.log(value)
			VUI.embedded_objects[value].element.addClass('hide');
		} catch (e) {

		}*/
	}






}