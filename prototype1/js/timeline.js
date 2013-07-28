// JavaScript Document

var Timeline = function (videoAssets, timelinename, parent) {
	
	this.videoAssets = videoAssets;
	var element = create_element("div", timelinename, ["timeline"], {});
	var scrubber = create_element("div", timelinename+"_scrubber", ["scrubber", "draggable"], {});	
	this.timelinename=timelinename;
	//
	console.log(parent);
	parent.append(element);
	element.appendChild(scrubber);
	
	this.element = $("#"+timelinename);
    //this.element.data_set=this;
	this.scrubber = $("#"+timelinename+"_scrubber");
    this.scrubber.css({"top": 0, "left": 0})
	this.scrubber.draggable(this.scrubber_fx);

    this.element.mousedown($.proxy(this.timeline_scrub_start,this));
    //this.element.mousemove($.proxy(this.timeline_scrub,this))
    this.element.mouseup($.proxy(this.timeline_scrub_end,this));
    this.element.mouseleave($.proxy(this.timeline_scrub_mouseleave(),this))
    this.element.mouseenter($.proxy(this.timeline_scrub_mouseenter(),this))
    this.mousehold_flag=false;


    this.timelength=0;
    this.truetime = 0;
    this.vidparts = new Array();

    for (var i=0; i<this.videoAssets.length; i++){
        var initial = this.timelength;
        this.timelength=this.timelength+(this.videoAssets[i].data.end-this.videoAssets[i].data.start);
        this.vidparts[i] = {
            idnum: this.videoAssets[i].idnum,
            start: initial,
            end: this.timelength,
            truestart: this.videoAssets[i].data.start
        }
    }

    console.log(this.timelength);

	
}

Timeline.prototype = {
    timeline_scrub_start: function(e){
        console.log(e.target.id);
        console.log(this.timelinename)
        if (e.target.id==this.timelinename){
            this.mousehold_flag=true;
        }

        if (this.mousehold_flag) {
            this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub: function(e) {
        if (this.mousehold_flag) {
            console.log(e.offsetX)
            this.timeline_scrub_function(e.offsetX-5);
        }
    },
    timeline_scrub_end: function(e) {
            this.mousehold_flag=false;
            console.log(e.offsetX)
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
            //this.timeline_scrub_function(e.offsetX-5);
        }
    },

    timeline_scrub_function: function(posx) {
        var prevnum = 0;
        var newnum = 0;
        for (var i=0; i<this.vidparts.length; i++){
            if ((this.vidparts[i].start<=this.truetime)&&(this.vidparts[i].end>this.truetime)){
                prevnum = this.vidparts[i].idnum
                UI.videoAssets[prevnum].pause();
                //$("#"+this.id).draggable("option", "target", target.vidparts[i].idnum);
                break;
            }
        }
        if (posx<0) posx=0;
        console.log(posx);
        var timer = (posx*this.timelength)/(this.element.width()-10);

        for (var i=0; i<this.vidparts.length; i++){
            if ((this.vidparts[i].start<=timer)&&(this.vidparts[i].end>timer)){
                newnum = this.vidparts[i].idnum
                if (prevnum!=newnum) {
                    UI.videoAssets[prevnum].on_back();
                    UI.videoAssets[newnum].on_show();

                }
                UI.videoAssets[newnum].seek((timer-this.vidparts[i].start)+this.vidparts[i].truestart)
                break;
            }
        }

        posx = (this.truetime*(this.element.width()-10))/this.timelength;

        this.scrubber.css({"left": posx});

    },
    
    scrubber_fx: {
        axis: 'x',
        containment: 'parent',
        start: function(){
            var target = UI.timelineset[this.id.replace("_scrubber","")];
            //console.log(target);
            for (var i=0; i<target.vidparts.length; i++){
                 if ((target.vidparts[i].start<=target.truetime)&&(target.vidparts[i].end>target.truetime)){
                    UI.videoAssets[target.vidparts[i].idnum].pause();
                    $("#"+this.id).draggable("option", "target", target.vidparts[i].idnum);
                     break;
                 }
            }
        },
        drag: function(){

        },
        stop: function(){
            var target = UI.timelineset[this.id.replace("_scrubber","")];

            var posx = target.scrubber.position().left;
            //console.log(posx);
            target.truetime=(posx*target.timelength)/(target.element.width()-10);
            //console.log(target.truetime)
            for (var i=0; i<target.vidparts.length; i++){
                if ((target.vidparts[i].start<=target.truetime)&&(target.vidparts[i].end>target.truetime)){
                    UI.videoAssets[$("#"+this.id).draggable("option", "target")].on_back();
                    UI.videoAssets[target.vidparts[i].idnum].on_show();
                    UI.videoAssets[target.vidparts[i].idnum].seek((target.truetime-target.vidparts[i].start)+target.vidparts[i].truestart);
                    break;

                }
            }
        }

    },
    updatepos: function(idnum, time){
        //console.log(time)

        for (var i=0; i<this.vidparts.length; i++){

            if (this.vidparts[i].idnum==idnum){
                this.truetime = time+this.vidparts[i].start;
                break;
            }

        }
        //console.log(truetime);
        var posx = (this.truetime*(this.element.width()-10))/this.timelength;

        this.scrubber.css({"left": posx});

    },
    gettime: function() {
       console.log(this.truetime)
       for (var i=0; i<this.vidparts.length; i++){
           if ((this.vidparts[i].start<=this.truetime)&&(this.vidparts[i].end>this.truetime)){
               //console.log(this.truetime)
                return {
                    time: (this.vidparts[i].end-this.truetime)+this.vidparts[i+1].truestart,
                    idnum: this.vidparts[i+1].idnum
                }
           }
       }
    }

}