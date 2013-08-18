/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 17/8/13
 * Time: 11:13 PM
 * To change this template use File | Settings | File Templates.
 */

//video_Player

"use strict";

/**
 * onYouTubePlayerReady

 Called when a videoPlayer object has been created.
 This initializes the videoPlayer and loads the video from Youtube.
 Comes with the Youtube API and is a necessary function

 Requirements:
 playerId - identification ID of the player. playerId should be videoID+videoPlayerID.

 */
function onYouTubePlayerReady(playerId) {

    //gets the videoID... It substracts videoPlayerID length, which is the global_id_length
    var video_id = playerId.substring(0, playerId.length-global_id_length);
    var video_Player_id = playerId.replace(video_id, "");

    var pre_corrected_Id = playerId;
    for (var i; i<playerId.length; i++) {
        if (playerId[i]=='_') pre_corrected_Id += '1'+i;
        else if (playerId[i]=='-') pre_corrected_Id += '2'+i;
    }
    var corrected_Id = pre_corrected_Id.replace(/\W/g, '');

    vD.i(video_Player_id).player.addEventListener("onError", "onPlayerError"+corrected_Id);
    vD.i(video_Player_id).player.addEventListener("onStateChange", "onStateChange"+corrected_Id);


    window["onPlayerError" + corrected_Id] = function(state) {
        vD.i(video_Player_id).on_player_Error(state);
    };

    window["onStateChange" + corrected_Id] = function(state) {
        vD.i(video_Player_id).on_player_State_Change(state);
    };

    vD.i(video_Player_id).player.loadVideoById(video_id, vD.i(video_Player_id).data.begin);
    vD.i(video_Player_id).player.setPlaybackQuality("default");
    vD.i(video_Player_id).seekBegin(true);

}

var videoPlayer = Class.extend({
    init: function(parent, data, width, sceneflag) {
        this.parent = parent;
        this.data = data;
        this.id = data.id;
        this.width = width;
        this.height = this.width*(9/16);
        this.sceneflag = sceneflag;

        this.currentTime = 0;
        this.playerID = this.data.object_data.id+this.id;
        this.mouse_option = null;
        this.mousedown_flag = false;
        this.mouseover_flag = false;
        this.playerFlag = false;
        this.interval_set = {};
        this.loaded = false;

        this.run();
    },

    run: function() {
        var playerContainerClass = null;
        if (!this.sceneflag) playerContainerClass='playerContainer';
        else playerContainerClass='main_playerContainer';

        this.player_container = saveElement(this.parent, "div", this.id+"_container", [playerContainerClass]);

        this.createEssentials();

        if (this.sceneflag) this.on_back();
        log("VideoPlayer: "+this.id+" created successfully", 1);
    },


    // player states and what to do
    on_player_State_Change: function(event) {
        if (event=='1') {
            this.playerFlag = true;
            this.timeline.timelength = this.data.end - this.data.begin;
            this.interval_set['checkposition'] = setInterval($.proxy(this.checkposition, this), 250);
            this.interval_set['check_trigger'] = setInterval($.proxy(this.check_trigger, this), 250);
        } else {
            this.playerFlag = false;
            for (var key in this.interval_set) {
                clearInterval(this.interval_set[key]);
                this.interval_set=null;
            }
        }

        if (event=='5') {
            this.loaded = true;
            this.timeline.timelength = this.data.end-this.data.begin;
        }
    },

    on_player_Error: function(event) {
        console.error(event);
    },
    on_show: function() {
        this.player_container.css('z-index', 11000);
        this.element.css('z-index', 11000);
        this.canvas.css('z-index', 11000);
        this.object_layer.css('z-index', 11000);
        this.discussion_area.css('z-index', 11000);
    },
    on_back: function() {
        if (this.player.pauseVideo!=null) {
            this.pause();
        }
        this.player_container.css('z-index', -11000);
        this.element.css('z-index', -11000);
        this.canvas.css('z-index', -11000);
        this.object_layer.css('z-index', -11000);
        this.discussion_area.css('z-index', -11000);
    },
    play: function() {
        if (this.loaded) {

            // removed if (!this.sceneflag)
            if (this.player.getCurrentTime()<this.data.begin) {
                this.player.seekTo(this.data.begin+0.1, false)
            }
            this.player.playVideo();
        } else {
            log("Video: "+this.data.object_data.id+" for "+this.id+" is not yet loaded", 1);
        }
    },
    pause: function() {
        this.player.pauseVideo();
    },
    seek: function(seconds, pauseflag) {
        this.player.stopVideo();
        this.player.seekTo(seconds, false);
        if (pauseflag) {
            this.player.playVideo();
            this.player.pauseVideo();
        } else {
            this.play();
        }
    },
    seekBegin: function(pauseflag) {
        this.seek(this.data.begin, pauseflag);
    },

    // On interval when playing
    checkposition: function() {

        // checks if this parent is hidden
        if (this.parent.hasClass("hide")) {
            for (var key in this.interval_sets) {
                clearInterval(this.interval_sets[key]);
                console.log(key);
            }
            return;
        }

        if ((this.player.getCurrentTime()-this.data.begin) >= this.currentTime) {

            this.currentTime = this.player.getCurrentTime() - this.data.begin;

        } else {
            // if new time is lower than currentTime
            this.currentTime = this.player.getCurrentTime() - this.data.begin;

        }

        if (!sceneflag) {
            // when currentTime is before the set data begin
            if (this.player.getCurrentTime() < this.data.begin) {
                this.seekBegin()
            } else if (this.player.getCurrentTime() > this.data.end) {
                this.seekBegin(true);
            }

            var timer = this.player.getCurrentTime();
            this.timeline.updatepos(timer);

        } else {

            if (this.player.getCurrentTime() < this.data.begin-0.1) {

                if (this.data.prev==null) {
                    this.seekBegin()
                } else {
                    this.seekBegin(true);
                    this.on_back();
                }

            } else if (this.player.getCurrentTime() > this.data.end) {

                this.pause();
                this.on_back();

                if (this.data.next!=null) {
                    vD.i(this.data.next).on_show();
                    vD.i(this.data.next).seekBegin();
                }
            } else {

                var timer = this.player.getCurrentTime();
                //vD.i("main_Timeline").updatepos(timer, this.id);

            }

        }
    },

    // create element areas
    createEssentials: function() {
        this.createPlayer();
        this.createTimeline();
        this.createCanvas();
        this.createLayerObjects();
        this.createDiscussionArea();
        this.createPlayerArea();
        this.createContextMenu();
        this.setPlayer();
    },
    createPlayer: function() {
        var address = "//www.youtube.com/apiplayer?controls=0"+
            "&enablejsapi=1"+
            "&rel=0"+
            "&showinfo=0"+
            "&autohide=1"+
            "&playerapiid="+this.playerID+
            "&version=3"+
            "&autoplay=0";

        var element = createElement("object", this.playerID, ["video_player"], {"type":"application/x-shockwave-flash",
            "data": address,
            "width":this.width,
            "height": this.height})

        var param = createElement("param", null, null, {"name":"allowScriptAccess", "value":"always"})
        var param2 = createElement("param", null, null, {"name":"wmode", "value":"opaque"})

        element.appendChild(param);
        element.appendChild(param2);

        this.player_container.append(element);
    },
    createTimeline: function() {
        try {
            this.timeline = new timeLine(this.player_container, this.id+"_timeline", this.data.end-this.data.begin, this.data.begin);
            if (this.sceneflag) {
                this.timeline.element.addClass('hide');
                this.timeline.scrubber.addClass('hide');
            }
            var res = vD.i(this.timeline);
            if (res==null) throw new Error ("Cannot create object videoPlayer");
        } catch(e) {
            this.generalError(e);
        }
    },
    createCanvas: function() {

        this.canvas = saveElement(this.player_container,
            "canvas",
            this.id+"_canvas",
            ["canvas_area"],
            {"width": this.width, "height": this.height});
        this.canvas.css({"z-index": -11000});
        this.canvas.data({"visible_flag": false});

    },
    createLayerObjects: function() {
        this.object_layer = saveElement(this.player_container, "div", this.id+"_object_layer", ["object_layer"]);
        this.object_layer.css({"width":this.width, "height": this.height});
    },
    createDiscussionArea: function() {
        this.discussion_area = saveElement(this.player_container, "div", this.id+"_discussion_area", ["discussion_area"]);
        this.discussion_area.css({"height": this.height});
    },
    createPlayerArea: function() {
        this.interactionElementData = {
            "id": this.id+"_area",
            "defaultMode": "normal",
            "class": ["player_area"],
            "css": {
                "top": 0,
                "left": 0,
                "width": this.width,
                "height": this.height
            },
            "on_click": {},
            "right_click": {},
            "on_mousedown": {},
            "on_mousemove": {},
            "on_mouseup": {},
            "on_mouseenter": {},
            "on_mouseleave": {}
        }

        this.setupInteractionElement();
        this.interactionElement = new interactionElement(this.player_container, this.interactionElementData);
        vD.i(this.interactionElement);
        this.element = this.interactionElement.element;
    },

    setupInteractionElement: function() {
        try {
            if (this.interactionElementData==null) throw new Error ("Setting up of the interactionElementData is not done");



        } catch (e) {
            this.generalError(e);
        }
    },

    setPlayer: function() {
        this.player_element = $("object#"+this.playerID);
        this.player = document.getElementById(this.playerID);
    },
    createContextMenu: function() {
        try {
            this.contextMenuData = {
                "id": this.id+"_context_menu",
                "video_id": this.id,
                "object_data": [
                    {
                        "id": this.id+"_add_comment",
                        "value": "Add Comment Thread",
                        callback: ($.proxy(this.context_menu_add_comment_thread, this))
                    },
                    {
                        "id": this.id+"_debug",
                        "value": "Debug",
                        callback: ($.proxy(this.context_menu_debug, this))
                    },
                    {
                        "id": this.id+"_save_data",
                        "value": "Save Data",
                        callback: ($.proxy(this.save_data, this))
                    }
                ]
            }

            //this.contextMenu = new contextMenu(this.element, this.contextMenuData);
            //if (res==null) throw new Error ("Cannot create object videoPlayer");
        } catch (e) {
            this.generalError(e);
        }
    },
    generalError: function(e) {
        console.error(e.stack);
        log(e.stack.toString());
    }
})