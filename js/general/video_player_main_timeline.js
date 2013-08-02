//main_Timeline

"use strict";

/*---------  Main Time Line ------------- */
var main_Timeline = function(parent, id) {
	this.parent = parent;
	this.id = id;
	this.classType = "main_Timeline"
	this.timeline_set = [];
    this.timeline_lengths = [];
    this.scene_set = {};
    this.temporary_set = []

	this.start();
}

main_Timeline.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

        try {
            //console.log(vData.data)
            if (vData.data.data.scene_objects.length==0) console.log("ehh")

            for (var i=0; i<vData.data.data.scene_objects.length; i++){

                this.add_to_timeline(vData.data.data.scene_objects[i]);

            }

		    if (debug) creation_success(this.classType, this.id)

            if (debug2) console.log(this)

        } catch (e) {
            console.error(e.stack);
            //console.log("Error at aisle 41")
        }

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

    add_to_timeline: function(data, flag) {

        var t_index = null;
        var index = null;

        var new_data = {"id": data.id,
            "prev": data.prev,
            "next": data.next,
            "begin": data.begin,
            "end": data.end}

        // if the scene is at the start of the timeline
        if (data.prev==null) {

            var timeline = [];

            timeline.push(new_data);
            index = timeline.indexOf(new_data);

            this.timeline_set.push(timeline);
            t_index = this.timeline_set.indexOf(timeline);



        } else {

            // checks if the previous scene is already been loaded
            if (this.scene_set[data.prev]!=null) {

                t_index = this.scene_set[data.prev].t_index;
                index = this.scene_set[data.prev].index+1;
                var timeline = this.timeline_set[t_index];

                timeline.splice(index, 0, new_data);

                this.timeline_set[t_index] = timeline;

            } else {

                if (flag==null) this.temporary_set.push(data);

            }

        }

        if ((index!=null) && (t_index!=null)) {
            this.scene_set[data.id] = {"index": index, "t_index": t_index};

            this.update_timeline_lengths(t_index);

            if (flag==null) {
                for (var i = 0; i<this.temporary_set.length; i++) {
                    if (this.add_to_timeline(this.temporary_set[i], true)) {
                        i = 0;
                    }
                }
            }

            return true
        } else {
            return false
        }


    },

    update_timeline_lengths: function(t_index) {

        var timeline = this.timeline_set[t_index];

        var timeline_length = 0;

        for (var i=0; i<timeline.length; i++) {

            var scene_length = timeline[i].end - timeline[i].begin;
            timeline_length += scene_length

        }

        this.timeline_lengths[t_index] = timeline_length

    }

}