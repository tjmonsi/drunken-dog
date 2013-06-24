/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/21/13
 * Time: 3:16 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

function onYouTubePlayerReady(playerId) {
    UI.video.player = document.getElementById("videoobject");
    // This causes the updatePlayerInfo function to be called every 250ms to
    // get fresh data from the player
    setInterval(updatePlayerInfo, 250);
    //updatePlayerInfo()
    UI.video.player.addEventListener("onError", "onPlayerError");

    //Load an initial video into the player
    UI.video.player.cueVideoById(UI.data[UI.data.length-1].video);
    UI.video.player.setPlaybackQuality("large");
    UI.video.play();
    UI.video.pause();
}

function onPlayerError(errorCode) {
    alert("An error occured of type:" + errorCode);
}

function updatePlayerInfo(){
    UI.video.on_playing();
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