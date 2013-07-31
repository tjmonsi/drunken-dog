//timeline_Player

"use strict";

/*---------------------- timeline_Player --------------------------*/

var timeline_Player = function(parent, id) {
    this.classType = "timeline_Player"
	this.parent = parent;
	this.id = id;
	this.video_id = id;

    this.start();
}

timeline_Player.prototype = {

    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

    init: function(){
        var element = create_element("div", this.id, ["timeline"], {});
        var scrubber = create_element("div", this.id+"_scrubber", ["scrubber"], {});

        element.appendChild(scrubber);
        this.parent.append(element);

        this.element = $("#"+this.id);
        this.scrubber = $("#"+this.id+"_scrubber");
        this.scrubber.css({"top": 0, "left": 0});

        this.scrubber.draggable(this.scrubber_fx);

        this.element.mousedown($.proxy(this.timeline_scrub_start,this));
        this.element.mouseup($.proxy(this.timeline_scrub_end,this));
        this.element.mouseleave($.proxy(this.timeline_scrub_mouseleave(),this));
        this.element.mouseenter($.proxy(this.timeline_scrub_mouseenter(),this));
        this.mousehold_flag=false;

        this.timelength=0;
        this.truetime = 0;

        if (debug) {
            var msg = this.classType+":"+this.id+" created successfuly"
            console.log(msg)
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

	timeline_scrub_start: function(e){
       // console.log(e.target.id);
       // console.log(this.id)
        if (e.target.id==this.id){
            this.mousehold_flag=true;
        }

        if (this.mousehold_flag) {
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub: function(e) {
        if (this.mousehold_flag) {
           // console.log(e.offsetX)
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub_end: function(e) {
            this.mousehold_flag=false;
            //console.log(e.offsetX)
    },

    timeline_scrub_mouseleave: function(e) {
        if (this.mousehold_flag) {
            this.mousehold_flag=false;
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub_mouseenter: function(e) {
        if (this.mousehold_flag) {
            this.mousehold_flag=false;
        }
    },

    timeline_scrub_function: function(posx) {;

        var timer = (posx*this.timelength)/(this.element.width()-10);
        this.scrubber.css({"left": posx});
        vData.instances[this.video_id].seek(timer);

    },

    updatepos: function(time){
        this.truetime = time;
        var posx = (this.truetime*(this.element.width()-10))/this.timelength;
        this.scrubber.css({"left": posx});

    },

    scrubber_fx: {
        axis: 'x',
        containment: 'parent',
        cursor: 'move',
        start: function(){
        	var target = vData.instances[this.id.replace("_timeline_scrubber", "")];
        	target.pause();
        },
        drag: function(){

        },
        stop: function(){
        	var target = vData.instances[this.id.replace("_timeline_scrubber", "")];
        	//console.log(target.timeline);
            var posx = target.timeline.scrubber.position().left;

            target.timeline.truetime=(posx*target.timeline.timelength)/(target.timeline.element.width()-10);
            target.seek(target.timeline.truetime);

        }

    }
}