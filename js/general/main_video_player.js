//main_Video_Player

"use strict";

/*---------------------- main_Video_Player -------------------------*/

var main_Video_Player = function(parent, data) {
	this.classType = "main_Video_Player"
	this.parent = parent;
	this.data = data;
    this.height = 0;
    this.video_set = {};

	this.start();

}

main_Video_Player.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

        try {
            this.id = this.data.id;

            this.element = save_element(this.parent, "div", this.id);

            if (vData.data.data.scene_objects.length==0) throw new Error ("No scenes at data to load video. please check");

            for (var i=0; i<vData.data.data.scene_objects.length; i++) {
                var data = vData.data.data.scene_objects[i];

                var obj = new video_Player(this.element, data, vid_max_width, true)

                this.video_set[data.id] = obj;
                vData.add_instances(obj)

                if (obj.player_container.outerHeight(true)>this.height) {
                    this.height = obj.player_container.outerHeight(true);
                }
                //onYoutubePlayerReady(obj.playerID)
            }

            vData.instances[vData.data.start_scene].on_show();

            this.element.css({"height": this.height})

            if (debug) creation_success(this.classType, this.id)

            if (debug2) console.log(this)
        } catch (e) {
            console.error(e.stack)
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
            } else if (key=='video_set') {
                for (var k in this[key]) {
                    this[key][k].destroy();
                }

            }
        }

        //add more here


        // this should be last
        vData.delete_instance(this.id);
    }

}