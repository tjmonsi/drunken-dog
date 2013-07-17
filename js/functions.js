/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/21/13
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

function onYouTubePlayerReady(playerId) {
	var idnum = parseInt(playerId.slice(-1));
	var data = playerId.substring(0, playerId.length-1);
	//console.log(player);
	
	//setInterval(updatePlayerInfo, 250);
	UI.videoAssets[idnum].player.addEventListener("onError", "onPlayerError");
	UI.videoAssets[idnum].player.cueVideoById(data);
	UI.videoAssets[idnum].player.setPlaybackQuality("default");
	UI.videoAssets[idnum].loaded=true;
	UI.videoAssets[idnum].seekpause(UI.videoAssets[idnum].data.start);
	//console.log(UI.videoAssets[idnum].data.start);
	checkAllVideo();

	
	//try {
	//	UI.videoAssets[idnum].player.playVideo();
	//} catch(e){
	//	console.log(e);	
	//}
	//UI.videoAssets[idnum].play();
    //UI.video.player = document.getElementById("videoobject");
    // This causes the updatePlayerInfo function to be called every 250ms to
    // get fresh data from the player
    //setInterval(updatePlayerInfo, 250);
    //updatePlayerInfo()
    //UI.video.player.addEventListener("onError", "onPlayerError");

    //Load an initial video into the player
    //UI.video.player.cueVideoById(UI.data[UI.data.length-1].video);
    //UI.video.player.setPlaybackQuality("large");
    //UI.video.play();
    //UI.video.pause();
	//console.log("this is called");
	//console.log(playerId);
	
}

function checkAllVideo() {
	var flag=true
	for (var i=0; i<UI.videoAssets.length; i++) {
		if (UI.videoAssets[i].loaded==false) 	{
			flag=false;	
		}		
	}
	if (flag && (UI.videoAssets.length==UI.videoset.length)) {
		UI.init2();	
		setInterval(updatePlayerInfo, 250);
		//console.log("error");
	}
}

function onPlayerError(errorCode) {
    alert("An error occured of type:" + errorCode);
}

function updatePlayerInfo(){
	//console.log("updatePlayerInfo");
    for (var i=0; i<UI.videoAssets.length; i++) {
		if (UI.videoAssets[i].playerflag){		
			UI.videoAssets[i].on_playing();		
		}
	}
	
	
}


function create_element(el, id, classes, attributes) {
    var element = document.createElement(el);
    // add id
    if (id) element.id = id;
    // add classes
    if (classes) {
        for (var classname in classes) {
            element.classList.add(classes[classname]);
        }
    }
    // add other attributes
    if (attributes) {
        var key;
        for (key in attributes) {
            var value = attributes[key];
            if (key == 'textContent') {
                element.textContent = value;
            }
            else {
                element.setAttribute(key, value);
            }
        }
    }
    return element;
}