// JavaScript Document

var Timeline = function (videoAssets, timelinename, parent) {
	
	this.videoAssets = videoAssets;
	var element = create_element("div", timelinename, ["timeline"], {});
	var scrubber = create_element("div", timelinename+"_scrubber", ["scrubber", "draggable"], {});	
	
	//
	console.log(parent);
	parent.append(element);
	element.appendChild(scrubber);
	
	this.element = $("#"+timelinename);
	this.scrubber = $("#"+timelinename+"_scrubber");

    this.scrubber.css({"top": 0, "left": 0})
	
	this.scrubber.draggable({axis:'x', containment: 'parent'});

    console.log(this.element.width())

    this.timelength=0;

    this.vidparts = new Array();

    for (var i=0; i<this.videoAssets.length; i++){
        var initial = this.timelength;
        this.timelength=this.timelength+(this.videoAssets[i].data.end-this.videoAssets[i].data.start);
        this.vidparts[i] = {
            idnum: this.videoAssets[i].idnum,
            start: initial,
            end: this.timelength
        }
    }

    console.log(this.timelength);

	
}

Timeline.prototype = {
    updatepos: function(idnum, time){
        //console.log(time)
        var truetime=0;
        for (var i=0; i<this.vidparts.length; i++){

            if (this.vidparts[i].idnum==idnum){
                truetime = time+this.vidparts[i].start;
                break;
            }

        }
        console.log(truetime);
        var posx = (truetime*this.element.width())/this.timelength;

        this.scrubber.css({"left": posx});

    }

}