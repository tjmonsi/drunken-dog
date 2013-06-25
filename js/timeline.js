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
	
	this.scrubber.draggable({axis:'x', containment: 'parent'});
	
}