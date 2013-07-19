"use strict";

function onYouTubePlayerReady(playerId) {
    //console.log(playerId)
    var video_id = playerId.substring(0, playerId.length-global_id_length);
    var pre_corrected_Id = playerId;
    for (var i; i<playerId.length; i++) {
        if (playerId[i]=='_') pre_corrected_Id += '1'+i;
        else if (playerId[i]=='-') pre_corrected_Id += '2'+i;
    }
    var corrected_Id = pre_corrected_Id.replace(/\W/g, '');

    Data.videoplayers[playerId].player.addEventListener("onError", "onPlayerError"+corrected_Id);
    Data.videoplayers[playerId].player.addEventListener("onStateChange", "onStateChange"+corrected_Id);



    window["onPlayerError" + corrected_Id] = function(state) {
        Data.videoplayers[playerId].on_player_Error(state);
    };

    window["onStateChange" + corrected_Id] = function(state) {
        Data.videoplayers[playerId].on_player_State_Change(state);
    };

    Data.videoplayers[playerId].player.cueVideoById(video_id);
    Data.videoplayers[playerId].player.setPlaybackQuality("default");
    Data.videoplayers[playerId].seekload(0);

}

function onPlayerError(errorCode) {
    console.log(errorCode);
}

function onStateChange(event) {
    console.log(event);
}

function updateSize(){
    win_width = $(document).width();
    win_height = $(document).height();

    UI.asset_bar.asset_bar_list_resize();
}

function makeID(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function save_element(parent, el, id, classes, attributes){
    var element = create_element(el, id, classes, attributes);
    parent.append(element);
    return $(el+"#"+id);
}

function br(){
    return create_element('br');
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