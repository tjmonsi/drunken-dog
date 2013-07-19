"use strict";

var toolkit_Data = function(parent) {
	this.parent = parent;
	this.videoplayers = {};
	//console.log(this.videoplayers['access']==null);

	this.video_assets = {};

	this.scene_objects = {};

	this.init();
}

toolkit_Data.prototype = {
	init: function() {

	},

	save_video_asset: function(data) {
		var id = data.id;
		if (this.is_video_asset_exists(id)) {
			return false;
		} else {
			this.video_assets[id]={"data":data};
			//console.log(video_assets[id]);
			return true;
		}
	},

	is_video_asset_exists: function(id) {
		if (this.video_assets[id]!=null) return true;
		else return false;
	},

	delete_video_asset: function(id){
		if (this.is_video_asset_exists(id)) {
			delete this.video_assets[id];
			return true;
		} else {
			return false;
		}
	},

	save_scene_object: function(id, data) {
		if (this.is_scene_object_exists[id]!=null) {
			return false;
		} else {
			this.scene_objects[id]={"data": data}
			return true;
		}
	},

	is_scene_object_exists: function(id) {
		if (this.scene_objects[id]!=null) {
			return true;
		} else return false;
	},

	delete_scene_object: function(id) {
		if (this.is_scene_object_exists(id)) {
			delete this.scene_objects[id];
			return true
		} else {
			return false
		}
	}


}