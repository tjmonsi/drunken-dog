"use strict";

/* onYouTubePlayerReady

Called when a videoPlayer object has been created.
This initializes the videoPlayer and loads the video from Youtube.
Comes with the Youtube API and is a necessary function

Requirements:
playerId - identification ID of the player. playerId should be videoID+videoPlayerID.

*/

function onYoutubePlayerReady(playerId) {

	//gets the videoID... It substracts videoPlayerID length, which is the global_id_length

	var video_id = playerId.subsrting(0, playerId.length-global_id_length);

	var pre_corrected_Id = playerId;
    for (var i; i<playerId.length; i++) {
        if (playerId[i]=='_') pre_corrected_Id += '1'+i;
        else if (playerId[i]=='-') pre_corrected_Id += '2'+i;
    }
    var corrected_Id = pre_corrected_Id.replace(/\W/g, '');

     try {
        VData.videoplayers[playerId].player.addEventListener("onError", "onPlayerError"+corrected_Id);
        VData.videoplayers[playerId].player.addEventListener("onStateChange", "onStateChange"+corrected_Id);
    } catch (e) {
        throw new Error(e)
    }   

}