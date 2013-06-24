/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 6/24/13
 * Time: 3:39 PM
 * To change this template use File | Settings | File Templates.
 */
/*
 *  Video Object
 */

var VideoObject = function(data, parent) {

    this.data = data;
    this.player=null;
    var element = create_element("object", data.video, ["videoobject"], {"type":"application/x-shockwave-flash", "data":"http://www.youtube.com/apiplayer?controls=0&enablejsapi=1&rel=0&showinfo=0&autohide=1&playerapiid=player1&version=3&autoplay=1", "width":1280, "height":720, "style":"top: 0px; left: 0px"})
    var param = create_element("param", null, null, {"name":"allowScriptAccess", "value":"always"})
    var invisibleboard = create_element("div", "top"+data.video, ["topobject"], {"style": "width:1280px; height:720px"});

    element.appendChild(param);

    parent.append(invisibleboard);
    parent.append(element);

    this.element = $("object#"+data.video);

    //console.log(this.element.css('top'));
    //this.element.css("left","0px");

    this.top = $("div#top"+data.video);
    //this.element.click($.proxy(UI.board.on_click, UI.board))
}

VideoObject.prototype = {
    on_playing: function() {
        if (UI.video.player.getPlayerState()==1) {
            this.checkposition();
        }
    },

    play: function() {
        this.player.playVideo();
        $(".object").addClass('invisible');
    },

    pause: function() {
        this.player.pauseVideo();
        $(".object").removeClass('invisible partialinvisible');
    },

    seek: function(seconds) {
        this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.play();
    },

    checkposition: function() {
        for (var i= UI.objects.length-1; i>=0; i--){

            if (UI.objects[i]!=null) {
                if(UI.objects[i].time <= this.player.getCurrentTime()) {
                    this.element.css('left', UI.objects[i].data.board*UI.frame_width);
                    this.top.css('left', UI.objects[i].data.board*UI.frame_width);
                    UI.board.element.animate({scrollLeft: (UI.objects[i].data.board*UI.frame_width)}, 'fast');

                    break;
                }
            }
        }

        console.log("newState");
    }


}