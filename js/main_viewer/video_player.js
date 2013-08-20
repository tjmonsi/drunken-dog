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
        this.playerFlag = false;
        this.interval_set = {};
        this.loaded = false;
        this.timeGate = false;
        this.fromPlay = false;
        this.fromPause = true;
        this.mouseDownTime = 0;
        this.mouseUpTime = 0;
        this.mouseTimeSpan = 200;
        this.bBoxData = {};
        this.bBoxUI_temp = null;

        this.open_windows = null;

        this.run();
    },

    run: function() {
        var playerContainerClass = null;
        if (!this.sceneflag) playerContainerClass='playerContainer';
        else playerContainerClass='main_playerContainer';

        this.playerContainer = saveElement(this.parent, "div", this.id+"_container", [playerContainerClass]);

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
            this.interval_set['check_trigger'] = setInterval($.proxy(this.checktrigger, this), 250);
            this.interactionElement.mode="normal";
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
        }
    },

    on_player_Error: function(event) {
        console.error(event);
    },
    on_show: function() {
        this.playerContainer.css('z-index', 11000);
        this.element.css('z-index', 11000);
        this.canvas.css('z-index', 11000);
        this.objectLayer.css('z-index', 11000);
        this.discussionArea.css('z-index', 11000);
    },
    on_back: function() {
        if (this.player.pauseVideo!=null) {
            this.pause();
        }
        this.playerContainer.css('z-index', -11000);
        this.element.css('z-index', -11000);
        this.canvas.css('z-index', -11000);
        this.objectLayer.css('z-index', -11000);
        this.discussionArea.css('z-index', -11000);
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
            this.player.playVideo();
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
            vD.reset_triggers(this.id, this.player.getCurrentTime());

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
    checktrigger: function() {
        var time = this.player.getCurrentTime();
        //console.log(time);
        var trigger_arr = vD.triggers(this.id, time);
        //console.log(trigger_arr);
        for (var i in trigger_arr) {
            for (var key in trigger_arr[i]) {

                var obj = trigger_arr[i][key];
                if (obj.triggered==false) {
                    //console.log("1:"+obj.id)
                    if (obj.type_trig=="begin") {
                        if (vD.i(obj.id).data.show) {
                            //console.log("2:"+obj.id)
                            vD.i(obj.id).on_show();
                            obj.triggered=true;
                        }

                        if (vD.i(obj.id).data.pause) {
                            if ((time>=obj.time) && (time-0.5)<=obj.time) {
                                this.pause();
                                this.interactionElement.mode = "trigger_pause";
                                //add timegate here
                                //if (vD)
                            }
                            obj.triggered=true;
                        }
                    } else if (obj.type_trig=="end") {
                        //console.log("3:"+obj.id);
                        vD.i(obj.id).on_hide();
                        //this.play();
                        obj.triggered=true;
                    }
                    vD.triggers(this.id, obj);
                }


                //trigger_arr[i][key] = obj;

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
    createCanvas: function() {

        this.canvas = saveElement(this.playerContainer,
            "canvas",
            this.id+"_canvas",
            ["canvas_area"],
            {"width": this.width, "height": this.height});
        this.canvas.css({"z-index": -11000});
        this.canvas.data({"visible_flag": false});

    },
    createLayerObjects: function() {
        this.objectLayer = saveElement(this.playerContainer, "div", this.id+"_objectLayer", ["objectLayer"]);
        this.objectLayer.css({"width":this.width, "height": this.height});
    },
    createDiscussionArea: function() {
        this.discussionArea = saveElement(this.playerContainer, "div", this.id+"_discussion_area", ["discussion_area"]);
        this.discussionArea.css({"height": this.height});
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

            this.interactionElementData.on_mousedown.normal = $.proxy(this.on_mousedown, this);
            this.interactionElementData.on_mousemove.normal = $.proxy(this.on_mousemove, this);
            this.interactionElementData.on_mouseup.normal = $.proxy(this.on_mouseup, this);

            this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);

            this.interactionElementData.on_click.open_window = $.proxy(this.on_click, this);
            this.interactionElementData.on_click.trigger_pause = $.proxy(this.on_trigger_click, this);

            this.interactionElementData.right_click.open_window = $.proxy(this.right_click, this);
            this.interactionElementData.right_click.trigger_pause = $.proxy(this.on_trigger_right_click, this);


        } catch (e) {
            this.generalError(e);
        }
    },

    right_click: function(event) {
        this.interactionElement.mode = "open_window";
        this.contextMenu.on_show(event.x, event.y);
        this.pause();
        return false;
    },
    on_trigger_right_click: function(event) {
        this.contextMenu.on_show(event.x, event.y);
        return false;
    },

    on_click: function(event) {
        this.contextMenu.on_hide();
        this.interactionElement.mode = "normal";
    },
    on_trigger_click: function(event) {
        this.contextMenu.on_hide();
    },

    on_mousedown: function(event) {

        try {
            if (event.target.id == this.element.attr('id')) {

                if (this.sceneflag) {
                    console.log(event.x+", "+event.y);

                    if (!this.timeGate) {

                        if (this.playerFlag) {
                            this.pause();
                            this.fromPlay = true;
                            this.fromPause = false;
                        } else {
                            this.fromPause = true;
                            this.fromPlay = false;
                        }
                    }
                } else {
                    if (this.playerFlag) {
                        this.pause();
                        this.fromPlay = true;
                        this.fromPause = false;
                    } else {
                        this.fromPause = true;
                        this.fromPlay = false;
                    }
                }

                this.mouseDownTime = event.data.timeStamp;
                this.bBoxData = {
                    x: event.x,
                    y: event.y,
                    xUL: event.x,
                    yUL: event.y,
                    xDR: event.x,
                    yDR: event.y
                }
            } else {
                // something here
            }
        } catch (e) {
            this.generalError(e);
        }
    },
    on_mousemove: function(event) {
        try {
            var new_x = event.x;
            var new_y = event.y;

            if (event.data.mousedown_flag) {
                /*if (event.target.id==this.element.attr('id')) {

                }*/
                console.log(event.x)
                var bBox = this.getBoundingBox(new_x, new_y);

                if (bBox == null) return;

                bBox.id = this.id+"__boundingBoxId";

                if (this.bBoxUI_temp == null) {
                    this.bBoxUI_temp = saveElement(this.objectLayer, "div", bBox.id, ['discussionBoundingBox']);
                }
                this.bBoxUI_temp.css({
                    "width": bBox.width,
                    "height": bBox.height,
                    "top": bBox.y,
                    "left": bBox.x
                });

            } else {
                // show/hide triggers
            }
        } catch (e) {
            this.generalError(e)
        }
    },
    on_mouseup: function(event) {
        try {
            var new_x = event.x;
            var new_y = event.y;

            if (event.target.id == this.element.attr('id')) {
                // add here to close all discussion triggers
            }

            this.mouseUpTime = event.data.timeStamp;
            var bBox = this.getBoundingBox(new_x, new_y);

            if (bBox!=null) {
                bBox.id = this.id+"_boundingBoxId";
                if (this.bBoxUI_temp == null) {
                    this.bBoxUI_temp = saveElement(this.objectLayer, "div", bBox.id, ['discussionBoundingBox']);
                }
                this.bBoxUI_temp.css({
                    "width": bBox.width,
                    "height": bBox.height,
                    "top": bBox.y,
                    "left": bBox.x
                });


                if ((this.mouseUpTime-this.mouseDownTime) <= this.mouseTimeSpan) {
                    if (this.fromPause) {
                        this.play();
                    }
                } else {
                    if ((bBox.width >= minBoundingBoxVal) && (bBox.height >- minBoundingBoxVal)) {
                        // add comment
                    } else {
                        if (this.fromPlay) {
                            this.play();
                        }
                    }
                }
            }

            if (this.bBoxUI_temp!=null) {
                this.bBoxUI_temp.remove();
                this.bBoxUI_temp = null;
                this.bBoxData = null;
            }

        } catch (e) {
            this.generalError(e);
        }
    },


    getBoundingBox: function(x, y) {
        if (this.bBoxData!=null) {
            if (x < this.bBoxData.x) {
                this.bBoxData.xUL = x;
                this.bBoxData.xDR = this.bBoxData.x;
            } else {
                this.bBoxData.xDR = x;
                this.bBoxData.xUL = this.bBoxData.x;
            }

            if (y < this.bBoxData.y) {
                this.bBoxData.yUL = y;
                this.bBoxData.yDR = this.bBoxData.y;
            } else {
                this.bBoxData.yDR = y;
                this.bBoxData.yUL = this.bBoxData.y;
            }

            var width = this.bBoxData.xDR - this.bBoxData.xUL;
            var height = this.bBoxData.yDR - this.bBoxData.yUL;

            return {
                "width": width,
                "height": height,
                x: this.bBoxData.xUL,
                y: this.bBoxData.yUL
            }

        } else {
            return null;
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
                        callback: ($.proxy(this.contextMenuAddCommentThread, this))
                    },
                    {
                        "id": this.id+"_debug",
                        "value": "Debug",
                        callback: ($.proxy(this.contextMenuDebug, this))
                    },
                    {
                        "id": this.id+"_save_data",
                        "value": "Save Data",
                        callback: ($.proxy(this.saveData, this))
                    }
                ]
            }

            this.contextMenu = new contextMenu(this.element, this.contextMenuData);
            var res = vD.i(this.contextMenu);
            if (res==null) throw new Error ("Cannot create contextMenu videoPlayer");
        } catch (e) {
            this.generalError(e);
        }
    },

    contextMenuDebug: function(event) {
        console.log(vD);
    },
    generalError: function(e) {
        console.error(e.stack);
        console.log(vD);
        log(e.stack.toString());
    }
})