/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/21/13
 * Time: 3:13 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

/* UI Start here */

var UI = {
    init: function() {
        UI.frame_width = UI.basic.width;
        UI.frame_height = UI.basic.height;
        UI.root = $("div#root");

        UI.board = new Board(UI.root);
		
		//UI.playflag = false;
		
		
		UI.videoAssets = new Array();
		
		for (var i=0; i<UI.videoset.length; i++) {
			UI.videoAssets[i] = new VideoObject(UI.videoset[i], UI.board.element, i);	
			//console.log(UI.videoset[i]);
		}
		
    },
	
	init2: function() {
		UI.videoAssets[0].on_show();
		UI.videoAssets[0].play();	
	}
}
