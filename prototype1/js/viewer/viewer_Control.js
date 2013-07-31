"use strict";

var viewer_Control = function(parent) {
	this.parent = parent;

	this.init();

}

viewer_Control.prototype = {
	init: function() {

		/* this is for the Youtube search */
		this.yt_API = "//gdata.youtube.com/feeds/api/";
		this.yt_API_version = "&v=2";
		this.yt_API_alt = "&alt=jsonc";

		// temporary array for playing videos
		this.currently_playing = null;
	}
}