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
    var video_id = playerId.split("%3A")[0];
    //console.log(video_id)
        //playerId.substring(0, playerId.length-global_id_length);
    var video_Player_id =  playerId.split("%3A")[1]
    //console.log(video_Player_id)
    var pre_corrected_Id = playerId;
    for (var i; i<playerId.length; i++) {
        if (playerId[i]=='_') pre_corrected_Id += '1'+i;
        else if (playerId[i]=='-') pre_corrected_Id += '2'+i;
    }
    var corrected_Id = pre_corrected_Id.replace(/\W/g, '');
    //console.log(corrected_Id)
    //console.log(vD.i(video_Player_id))
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
        this.playerID = this.data.object_data.id+":"+this.id;
        this.mouse_option = null;
        this.playerFlag = false;
        this.interval_set = {};
        this.loaded = false;
        this.timeGate = false;
        this.fromPlay = false;
        this.fromPause = true;
        this.mouseDownTime = 0;
        this.mouseUpTime = 0;
        this.mouseTimeSpan = 200;
        this.bBoxData = null;
        this.bBoxUI_temp = null;

        this.open_windows = null;

        // for clicks
        this.on_trigger_click_flag = false;
        this.on_add_new_comment_flag = false;
        this.on_trigger_pause = false;

        this.annotation_id = null;

        // mouse modes
        this.last_mode = null

        // for drawing
        this.drawingObject = null
        this.drawing_pts = []

        // any open comments
        this.open_comments = null;

        // on_show discussion pts
        this.discussion_pts = {};

        this.visible_objects = {};

        this.run();
    },

    run: function() {
        var playerContainerClass = null;
        if (!this.sceneflag) playerContainerClass='playerContainer';
        else playerContainerClass='main_playerContainer';

        this.playerContainer = saveElement(this.parent, "div", this.id+"_container", [playerContainerClass]);

        this.createEssentials();

        if (this.sceneflag) this.on_back();
        //log("VideoPlayer: "+this.id+" created successfully", 1);
    },

    // player states and what to do
    on_player_State_Change: function(event) {
        if (event=='1') {
            log("videoPlayer:play:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+this.player.getCurrentTime())
            this.playerFlag = true;
            this.timeline.timelength = this.data.end - this.data.begin;
            this.interval_set['checkposition'] = setInterval($.proxy(this.checkposition, this), 250);
            //this.interval_set['check_trigger'] = setInterval($.proxy(this.checktrigger, this), 250);
            this.interval_set['update_timer'] = setInterval($.proxy(this.updateTimer, this), 250);
            this.last_mode = this.interactionElement.switchMode("normal")
            // DT (Cancel) from MenuPause, CommentPause, DrawPause
            this.closeAddNewComment();
            this.contextMenu.on_hide();
            this.openedComment();
            this.on_trigger_pause = false;

        } else {
            this.playerFlag = false;
            for (var key in this.interval_set) {
                clearInterval(this.interval_set[key]);
                this.interval_set[key]=null;
            }
        }

        if (event=='5') {
            this.loaded = true;
            this.timeline.timelength = this.data.end-this.data.begin;
            //this.checktrigger();
            this.updateTimer();
            this.checkposition();
        }
    },

    on_player_Error: function(event) {
        console.error(event);
    },
    on_show: function() {
        this.playerContainer.css('z-index', 11000);
        this.element.css('z-index', 11000);
        //this.canvas.css('z-index', 11000);
        //this.objectLayer.css('z-index', 11000);
        //this.discussionArea.css('z-index', 11000);
    },
    on_back: function() {
        if (this.player.pauseVideo!=null) {
            this.pause();
        }
        this.playerContainer.css('z-index', -11000);
        this.element.css('z-index', -11000);
        //this.canvas.css('z-index', -11000);
        //this.objectLayer.css('z-index', -11000);
        //this.discussionArea.css('z-index', -11000);
    },
    play: function() {
        if (this.loaded) {

            // removed if (!this.sceneflag)
            if (this.player.getCurrentTime()<this.data.begin) {
                this.player.seekTo(this.data.begin+0.1, false)
            }
            this.player.playVideo();
        } else {
            //log("Video: "+this.data.object_data.id+" for "+this.id+" is not yet loaded", 1);
        }
    },
    pause: function() {
        if (this.loaded)
            if (this.playerFlag) log("videoPlayer:pause:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+this.player.getCurrentTime())
        this.player.pauseVideo();
    },
    seek: function(seconds, pauseflag) {
        this.player.stopVideo();
        this.player.seekTo(seconds, false);
        if (pauseflag) {
            this.player.playVideo();
            this.player.pauseVideo();
            if (this.loaded)
                if (this.playerFlag) log("videoPlayer:seekPause:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+this.player.getCurrentTime())
        } else {
            this.player.playVideo();
        }
        //this.checktrigger();
        this.updateTimer();
        this.checkposition();
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
                //console.log(key);
            }
            return;
        }

        if ((this.player.getCurrentTime()-this.data.begin) >= this.currentTime) {

            this.currentTime = this.player.getCurrentTime() - this.data.begin;

        } else {
            // if new time is lower than currentTime
            //vD.reset_triggers(this.id, this.player.getCurrentTime());

            this.currentTime = this.player.getCurrentTime() - this.data.begin;

        }

        if (!this.sceneflag) {
            // when currentTime is before the set data begin
            if (this.player.getCurrentTime() < this.data.begin) {
                this.seekBegin()
            } else if (this.player.getCurrentTime() > this.data.end) {
                this.seekBegin(true);
            }

            var timer = this.player.getCurrentTime();
            this.timeline.updatepos(timer);

        } else {

            if (this.player.getCurrentTime() < this.data.begin-0.2) {

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
                vD.i("mainTimeline").updatepos(timer, this.id);

            }

        }
    },

    updateTimer: function() {
        this.visualTimer.empty();
        var timer = this.player.getCurrentTime();
        var begin = this.data.begin;
        var truetime = timer//-begin;

        var min = parseInt(truetime/60);
        var sec = truetime%60;
        var millisec = (sec/100)*100

        var sec_string = sec.toString();
        var millisec = sec_string.split(".")[1].substring(0,2)

        //millisec = millisec.toString();

        if (sec < 10) {
            sec_string = "0"+sec_string
        }

        var text = min+":"+sec_string.split(".")[0]+"."+millisec;

        text = text+" = "+timer.toString();
        this.visualTimer.append(text);
    },

    // create element areas
    createEssentials: function() {
        this.createPlayer();
        this.createTimeline();
        this.createTimer();

        this.createPlayerArea();
        //this.createContextMenu();
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

        this.playerContainer.append(element);
    },
    createTimeline: function() {
        try {
            var timelineData = {
                id: this.id+"_timeline",
                width: this.width,
                height: this.height
            }

            this.timeline = new timeLine(this.playerContainer, timelineData, this.data.end-this.data.begin, this.data.begin);
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
    createTimer: function() {
        this.visualTimer = saveElement(this.playerContainer, "div", this.id+"_visualTimer", ["visualTimer"]);
        this.visualTimer.css({"top": this.height-17, "left": this.width-56})
    },

    createPlayerArea: function() {
        this.interactionElementData = {
            "id": this.id+"_area",
            "defaultMode": "normal",
            "class": ["player_area"],
            "default_return_val": true,
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
        this.interactionElement = new interactionElement(this.playerContainer, this.interactionElementData);
        vD.i(this.interactionElement);
        this.element = this.interactionElement.element;
    },
    setupInteractionElement: function() {
        try {
            if (this.interactionElementData==null) throw new Error ("Setting up of the interactionElementData is not done");

            this.interactionElementData.on_click.normal = $.proxy(this.on_click, this);
            /*// States Pause and Play
            this.interactionElementData.on_mousedown.normal = $.proxy(this.on_mousedown, this);
            this.interactionElementData.on_mousemove.normal = $.proxy(this.on_mousemove, this);
            this.interactionElementData.on_mouseup.normal = $.proxy(this.on_mouseup, this);
            this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);

            // State MenuPause
            this.interactionElementData.on_click.open_window = $.proxy(this.on_click, this);
            this.interactionElementData.right_click.open_window = $.proxy(this.right_click, this);

            // State CommentPause
            this.interactionElementData.right_click.addNewComment = $.proxy(this.on_new_comment_right_click, this);
            this.interactionElementData.on_mousedown.addNewComment = $.proxy(this.on_bBoxCreate, this);
            this.interactionElementData.on_mousemove.addNewComment = $.proxy(this.on_bBoxMouseMove, this);
            this.interactionElementData.on_mouseup.addNewComment = $.proxy(this.on_bBoxMouseUp, this);

            // State Draw
            this.interactionElementData.on_mousedown.draw = $.proxy(this.on_drawStart, this);
            this.interactionElementData.on_mousemove.draw = $.proxy(this.on_drawMove, this);
            this.interactionElementData.on_mouseup.draw = $.proxy(this.on_drawStop, this);

            // Trigger_Pause
            this.interactionElementData.right_click.trigger_pause = $.proxy(this.right_click, this);
            this.interactionElementData.on_mousedown.trigger_pause = $.proxy(this.on_bBoxCreate, this);
            this.interactionElementData.on_mousemove.trigger_pause = $.proxy(this.on_bBoxMouseMove, this);
            this.interactionElementData.on_mouseup.trigger_pause = $.proxy(this.on_bBoxMouseUp, this);

            // Trigger_Pause_MenuPause
            this.interactionElementData.on_click.trigger_pause_2 = $.proxy(this.on_trigger_click, this);

            /*



             this.interactionElementData.on_click.addNewComment_2 = $.proxy(this.on_new_comment_click, this);




             this.interactionElementData.right_click.trigger_pause_2 = $.proxy(this.on_trigger_right_click, this);

             this.interactionElementData.right_click.addNewComment_2 = $.proxy(this.on_new_comment_right_click, this);
             */

        } catch (e) {
            this.generalError(e);
        }
    },

    on_click: function() {
        //console.log(this.playerFlag)
        if (this.playerFlag) {
            this.pause();
        } else {
            this.play();
        }
    },

    setPlayer: function() {
        this.player_element = $("object#"+this.playerID);
        this.player = document.getElementById(this.playerID);
    },

    generalError: function(e) {
        console.error(e.stack);
        console.log(vD);
        log(e.stack.toString());
    }
})