"use strict";

var toolkit_Control = function(parent) {
	this.parent = parent;

	this.init();
}

toolkit_Control.prototype = {
	init: function() {

		/* this is for the Youtube search */
		this.yt_API = "http://gdata.youtube.com/feeds/api/";
		this.yt_API_version = "&v=2";
		this.yt_API_alt = "&alt=jsonc";

		// temporary array for playing videos
		this.currently_playing = null;
	},

	/* List of functions for getting new asset */
	call_new_asset_window: function() {
		if (!UI.new_asset_window) UI.new_asset_window = new new_Asset_Window(UI.parent);
	},

	call_youtube_list: function(index, page_load, search, search_time) {
		var st_index = "&start-index="+index;
		var st_page_load = "&max-results="+page_load;

		if (typeof(search_time)==='undefined') search_time='today';
		var st_search_time = "&time="+search_time;

		var st_search = ""
		if ((typeof(search)==='undefined') || ($.trim(search)=="")) {
			st_search += "standardfeeds/top_rated?"
		} else {
			st_search += "videos?q="+search;
		}

		$.getJSON(this.yt_API+
			st_search+
			this.yt_API_version+
			this.yt_API_alt+
			st_index+
			st_page_load+
			st_search_time, 
			function(data) {
				Control.send_youtube_retrieved_list(data);
			}
		);

		return this.youtube_data;
	},

	send_youtube_retrieved_list: function(data) {
		//console.log(data)
		UI.new_asset_window.new_data(data);
	},

	send_to_asset: function(event, object) {

		var new_asset = $(object.draggable.context);
		new_asset.appendTo(UI.asset_bar.asset_list_view.cview);

		/*
		$item.fadeOut(function() {
        var $list = $( "ul", $trash ).length ?
          $( "ul", $trash ) :
          $( "<ul class='gallery ui-helper-reset'/>" ).appendTo( $trash );
 
        $item.find( "a.ui-icon-trash" ).remove();
        $item.append( recycle_icon ).appendTo( $list ).fadeIn(function() {
          $item
            .animate({ width: "48px" })
            .find( "img" )
              .animate({ height: "36px" });
        });
      });
		*/
	}
}