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
    //playerId.substring(0, playerId.length-global_id_length);
    var video_Player_id = playerId.split("%3A")[1];
    //playerId.replace(video_id, "");

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

        this.comment_videos = {};

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
            this.interval_set['check_trigger'] = setInterval($.proxy(this.checktrigger, this), 250);
            this.interval_set['update_timer'] = setInterval($.proxy(this.updateTimer, this), 250);
            this.last_mode = this.interactionElement.switchMode("normal")
            // DT (Cancel) from MenuPause, CommentPause, DrawPause
            this.closeAddNewComment();
            this.contextMenu.on_hide();
            this.openedComment();
            this.on_trigger_pause = false;

            //if (this.data.playrate!=null) {
                //console.log(this.player.getAvailablePlaybackRates());
                //this.player.setPlaybackRate(this.data.playrate);
            //}

        } else {
            //if (this.loaded)
            this.playerFlag = false;
            for (var key in this.interval_set) {
                clearInterval(this.interval_set[key]);
                this.interval_set[key]=null;
            }
        }

        if (event=='5') {
            this.loaded = true;
            this.timeline.timelength = this.data.end-this.data.begin;
            this.checktrigger();
            this.updateTimer();
            this.checkposition();
            if (this.data.autoplay!=null) {
                if (this.data.autoplay) {
                    this.play();
                }
            }

        }
    },

    on_player_Error: function(event) {
        console.error(event);
        //this.player.loadVideoById(this.data.object_data.id, this.data.begin);
        //this.player.setPlaybackQuality("default");
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
        //try {
        // checks if this parent is hidden
        if (this.parent.hasClass("hide")) {
            for (var key in this.interval_sets) {
                clearInterval(this.interval_sets[key]);
                //console.log(key);
            }
            return;
        }

        this.removeVideoObjects();

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
        try {
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
                                    this.last_mode = this.interactionElement.switchMode("trigger_pause")
                                    this.on_trigger_pause = true;
                                    //add timegate here
                                    //if (vD)
                                }
                                obj.triggered=true;
                            }
                        } else if (obj.type_trig=="end") {
                            //console.log("3:"+obj.id);
                            vD.i(obj.id).on_hide();
                            //console.log(obj);
                            //this.play();
                            //obj.triggered=true;
                        }
                        vD.triggers(this.id, obj);
                    }


                    //trigger_arr[i][key] = obj;

                }
            }

            var discussion_arr = vD.dt(this.id, time);

            if( Object.prototype.toString.call( discussion_arr ) === '[object Array]' ) {
                //alert( 'Array!' );
                for (var i in discussion_arr) {
                    for (var k in discussion_arr[i]) {
                        if (this.discussion_pts[k]==null) {
                            //console.log(k);
                            vD.i(k+"_discussionTrigger").on_show();
                            this.discussion_pts[k]=discussion_arr[i][k];
                            //console.log("revived "+k);
                            //console.log(this.discussion_pts[k])
                        }
                    }
                    //console.log(discussion_arr[j].id)
                    //vD.i(discussion_arr[j].id+"_discussionTrigger").on_show();
                    //this.discussion_pts[discussion_arr[j].id]=discussion_arr[j];
                }
            } else {
                for (var k in discussion_arr) {
                    if (this.discussion_pts[k]==null) {
                        console.log(k);
                        vD.i(k+"_discussionTrigger").on_show();
                        this.discussion_pts[k]=discussion_arr[k];
                        //console.log("revived "+k);
                        //console.log(this.discussion_pts[k])
                    }
                }
            }

            //console.log(discussion_arr)


            for (var k in this.discussion_pts) {
                if (this.discussion_pts[k]==null) continue;
                if ((time<this.discussion_pts[k].time-comment_time) || (time>this.discussion_pts[k].time+comment_time+1)) {
                    vD.i(this.discussion_pts[k].id+"_discussionTrigger").on_hide();

                    for (var i in this.visible_objects) {
                        if (this.visible_objects[i]!=null)
                        if (this.visible_objects[i].discussion_id == this.discussion_pts[k].id) {
                            this.removeEmbeddedDrawing(i);
                        }
                    }
                    //console.log("killed "+k);
                    this.discussion_pts[k]=null;
                }
            }
        } catch (e) {
            console.error(e.stack);

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

    // remove extra objects {
    removeVideoObjects: function() {
        //console.log(this.id);
        // check visible comment videos and closes
        if (this.comment_videos != {}) {

            for (var i in this.comment_videos) {
                if (vD.i(this.comment_videos[i])!=null) {
                    //console.log(vD.i(this.comment_videos[i]));
                    if (vD.i(this.comment_videos[i]) != null)
                    vD.i(this.comment_videos[i]).closeWindow();
                }

                this.comment_videos[i]=null;
            }

        }
        this.comment_videos = {}
    },

    // create element areas
    createEssentials: function() {
        this.createPlayer();
        this.createTimeline();
        this.createTimer();
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
    createTimer: function() {
        this.visualTimer = saveElement(this.playerContainer, "div", this.id+"_visualTimer", ["visualTimer"]);
        this.visualTimer.css({"top": this.height-17, "left": this.width-56})
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
        this.discussionBoxDefault = 200
        this.discussionArea = saveElement(this.playerContainer, "div", this.id+"_discussionArea", ["discussionArea"]);
        this.discussionArea.css({"height": this.height, "width": 450, "top": 0, "left": this.width, "overflowY": "auto"});
        this.discussionAreaBBox = saveElement(this.discussionArea, "div", this.id+"_discussionAreaBox", ["discussionAreaBox", "hide"]);
        this.discussionAreaBBox.css({"top": this.discussionBoxDefault , "width": this.discussionArea.outerWidth(true)});
        this.discussionAreaBeforeSpace = saveElement(this.discussionArea, "div", this.id+"_discussionAreaBeforeSpace", ["discussionAreaBeforeSpace"]);
        this.discussionAreaBeforeSpace.css({"height": this.discussionBoxDefault , "width": this.discussionArea.width()-50});
        this.discussionAreaAfterSpace = saveElement(this.discussionArea, "div", this.id+"_discussionAreaAfterSpace", ["discussionAreaBeforeSpace"]);
        this.discussionAreaAfterSpace.css({"height": this.discussionArea.height()-this.discussionBoxDefault , "width": this.discussionArea.width()-50});
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

            // States Pause and Play
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

    // Invoked by Comments
    closeAddNewComment: function(){
        if (this.windowAddNewComment!=null) {
            if (vD.i(this.windowAddNewComment.id)==null) this.windowAddNewComment=null
        }
        if (this.windowAddNewComment!= null) this.windowAddNewComment.closeWindow();
    },
    openedComment: function(obj, val) {
        if (val) {
            this.open_comments = null
            return
        }
        if (this.open_comments!=null) {
            this.open_comments.on_hidebBox();
            this.open_comments.on_collapse();


        }
        this.open_comments=obj;
    },

    // Normal (Pause and Play)
    right_click: function(event) {
        if (event.target.id==this.element.attr('id')) {

            //if (this.on_trigger_pause) this.last_mode = this.interactionElement.switchMode("trigger_pause");
            //else this.last_mode = this.interactionElement.switchMode("trigger_pause_2")
            this.last_mode = this.interactionElement.switchMode("open_window")

            // RC from Play and Pause to MenuPause
            this.contextMenu.on_show(event.x, event.y);
            log("videoPlayer:right_click:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
            this.pause();
            return false;
        }
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
                log("videoPlayer:on_mousedown:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
                this.mouseDownTime = event.data.timeStamp;
                this.on_bBoxCreate(event);
            } else {
                // something here
            }
        } catch (e) {
            this.generalError(e);
        }
    },
    on_mousemove: function(event) {
        try {
            if (event.data.mousedown_flag) {
                /*if (event.target.id==this.element.attr('id')) {

                 }*/
                //console.log(event.x)
                this.on_bBoxMouseMove(event);
            } else {
                // show/hide triggers
                this.discussionPtsFade(event.x, event.y);
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
                        // SC from Pause to Play
                        this.play();
                    }
                } else {
                    if ((bBox.width >= minBoundingBoxVal) && (bBox.height >= minBoundingBoxVal)) {
                        // add comment
                        var data = {
                            "id": this.id+"_addNewCommentThread",
                            "video_id": this.id,
                            "x": bBox.x+bBox.width,
                            "y": bBox.y+bBox.height,
                            "windowName": 'New Discussion Thread',
                            "draggable": false,
                            "time": this.player.getCurrentTime(),
                            "pad": "pad20",
                            "bBox": bBox
                        }
                        console.log(bBox);
                        log("videoPlayer:on_createNewComment:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())

                        this.windowAddNewComment = new addNewDiscussion(this.element, data);
                        // LCLD from Play/Pause (Normal) to CommentPause
                        this.last_mode = this.interactionElement.switchMode("addNewComment")
                        this.openedComment();

                    } else {
                        if (this.fromPlay) {
                            // SC from Play to Pause
                            // LCSD from Play to Play
                            this.play();
                        }

                        // LCSD from Pause to Pause
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

    // MenuPause
    on_click: function(event) {
        if (event.target.id==this.element.attr('id')) {
            // SC/LC and Comment from MenuPause to Pause or CommentPause
            log("videoPlayer:cancelComment:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
            this.contextMenu.on_hide();
            this.openedComment();
            if (this.on_trigger_pause) this.last_mode = this.interactionElement.switchMode("trigger_pause");
            else this.last_mode = this.interactionElement.switchMode("normal");
        }

    },

    // CommentPause
    on_new_comment_right_click: function(event) {
        if (event.target.id==this.element.attr('id')) {
            log("videoPlayer:right_click:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
            // RC from CommentPause
            this.closeAddNewComment();
            // to MenuPause
            this.contextMenu.on_show(event.x, event.y);
            this.last_mode = this.interactionElement.switchMode("open_window")
            this.openedComment();

            return false;
        }
    },
    on_bBoxCreate : function(event) {
        try {
            if (event.target.id == this.element.attr('id')) {
                this.bBoxData = {
                    x: event.x,
                    y: event.y,
                    xUL: event.x,
                    yUL: event.y,
                    xDR: event.x,
                    yDR: event.y
                }
                log("videoPlayer:on_mousedown:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
                this.contextMenu.on_hide();
            }
        } catch (e) {
            this.generalError(e);
        }
    },
    on_bBoxMouseMove: function(event) {



        if (event.data.mousedown_flag) {
            var new_x = event.x;
            var new_y = event.y;
            var bBox = this.getBoundingBox(new_x, new_y);

            if (bBox == null) return;
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
        } else {
            this.discussionPtsFade(event.x, event.y);
        }
    },
    on_bBoxMouseUp: function(event) {
        var new_x = event.x;
        var new_y = event.y;
        var bBox = this.getBoundingBox(new_x, new_y);
        //console.log(bBox)
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

            if ((bBox.width >= minBoundingBoxVal) && (bBox.height >= minBoundingBoxVal)) {
                // add comment
                this.closeAddNewComment();
                //console.log("hello");
                var data = {
                    "id": this.id+"_addNewCommentThread",
                    "video_id": this.id,
                    "x": bBox.x+bBox.width,
                    "y": bBox.y+bBox.height,
                    "windowName": 'New Discussion Thread',
                    "draggable": false,
                    "time": this.player.getCurrentTime(),
                    "pad": "pad20",
                    "bBox": bBox
                }
                console.log(bBox);
                log("videoPlayer:on_createNewComment:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
                this.windowAddNewComment = new addNewDiscussion(this.element, data);
                // LCLD from CommentPause to CommentPause
                this.last_mode = this.interactionElement.switchMode("addNewComment")
                this.openedComment();

                this.on_add_new_comment_flag = false;
            } else {
                if (this.interactionElement.mode=="addNewComment") {
                    if (!this.on_trigger_click_flag) {
                        //LCSD/SC from CommentPause to Pause(Normal) or Pause(TriggerPause)
                        this.contextMenu.on_hide();
                        this.closeAddNewComment();
                        this.openedComment();
                        if (this.on_trigger_pause) this.last_mode = this.interactionElement.switchMode("trigger_pause");
                        else this.last_mode = this.interactionElement.switchMode("normal");
                        this.pause();
                        /*// LCSD/SC from CommentPause to Play(Normal)
                        if (this.on_add_new_comment_flag){
                            this.on_add_new_comment_flag = false;
                            // CHECK UP WITH THIS
                            this.play();
                        } else {
                            // LCSD/SC from CommentPause to Pause(Normal)
                            this.contextMenu.on_hide();
                            this.closeAddNewComment();
                            this.on_add_new_comment_flag = true;
                        }*/
                    }
                }
                // do something else
            }
        }
        if (this.bBoxUI_temp!=null) {
            this.bBoxUI_temp.remove();
            this.bBoxUI_temp = null;
            this.bBoxData = null;
        }
    },

    // Trigger_Pause_Menu
    on_trigger_click: function(event) {
        if (event.target.id==this.element.attr('id')) {
            log("videoPlayer:cancelComment:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
            this.contextMenu.on_hide();
            this.closeAddNewComment();
            this.openedComment();
            this.last_mode = this.interactionElement.switchMode("trigger_pause");
            /*if (this.on_trigger_click_flag) {
                this.on_trigger_click_flag = false;
                // CHECK UP WITH THIS
                this.play();
            } else {
                this.contextMenu.on_hide();
                this.closeAddNewComment();
                this.on_trigger_click_flag = true;
            }*/
        }
    },
    /*
    on_trigger_right_click: function(event) {

        if (event.target.id==this.element.attr('id')) {
            this.contextMenu.on_show(event.x, event.y);
            this.on_trigger_click_flag = false;
            this.last_mode = this.interactionElement.switchMode("trigger_pause_2")

            return false;
        }
    },





    on_new_comment_click: function(event) {
        if (event.target.id==this.element.attr('id')) {
            if (this.on_add_new_comment_flag){
                this.on_add_new_comment_flag = false;
                // CHECK UP WITH THIS
                this.play();
            } else {
                this.contextMenu.on_hide();
                this.closeAddNewComment();
                this.on_add_new_comment_flag = true;
            }
        }
    },
    */

    // Fading in and out TriggerPts
    discussionPtsFade: function(x,y) {
        //var time = this.player.getCurrentTime();
        for (var k in this.discussion_pts) {
            if (this.discussion_pts[k]==null) continue;
            var obj = vD.i(this.discussion_pts[k].id+"_discussionTrigger");
            var area = 500;

            if (withinArea(x, y, obj.data.x, obj.data.y, area)) {
                var xval = Math.abs((x-obj.data.x)/area);
                var yval = Math.abs((y-obj.data.y)/area);

                var op = 1 - ((xval+yval)/2);

                vD.i(this.discussion_pts[k].id+"_discussionTrigger").changeOpacity(op);

            }

        }


    },

    backToMode: function() {
        if (this.on_trigger_pause) this.last_mode = this.interactionElement.switchMode("trigger_pause");
        else this.last_mode = this.interactionElement.switchMode("normal");
    },

    getBoundingBox: function(x, y) {
        //console.log(this.bBoxData);
        //if (this.bBoxData=={}) return null;
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

    startAnnotation: function(data){
        log("videoPlayer:startAnnotation:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+data.discussion_id+":"+data.id+":"+this.player.getCurrentTime())
        this.annotation_id = data.id;
        this.discussion_id = data.discussion_id;
        // StartDraw from CommentPause to DrawPause
        this.last_mode = this.interactionElement.switchMode("draw")

        this.canvas.data({"visible_flag": true});
    },
    on_drawStart: function(event) {
        do {
            var drawing_id = makeID(global_id_length*2);
        } while(vD.a(drawing_id)!=null);

        this.drawingObject = {
            type: "line",
            strokeStyle: "#585",
            name: drawing_id,
            layer: "true",
            strokeWidth: 3,
            rounded: true,
            visible: true,
            "x1": event.x, "y1": event.y,
            "data": {
                "video_id": this.data.id,
                "comment_id": this.annotation_id,
                "discussion_id":this.discussion_id,
                "type": "annotation"
            }
        }
        //this.canvas.addLayerToGroup(drawing_id, "commentAnnotation");
        this.drawing_pts = [{"x": event.x, "y": event.y}];
        for (var i=1; i<this.drawing_pts.length ; i++) {
            var val = i+1;
            this.drawingObject['x'+(val)]=this.drawing_pts[i].x
            this.drawingObject['y'+(val)]=this.drawing_pts[i].y
        }
        log("videoPlayer:startDrawing:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+this.discussion_id+":"+this.annotation_id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
        this.canvas.addLayer(this.drawingObject).drawLayers();

    },
    on_drawMove: function(event) {
        if (event.data.mousedown_flag) {
            this.drawing_pts.push({"x": event.x, "y":event.y});
            for (var i=1; i<this.drawing_pts.length ; i++) {
                var val = i+1;
                this.drawingObject['x'+val]=this.drawing_pts[i].x
                this.drawingObject['y'+val]=this.drawing_pts[i].y
            }
            //console.log(this.drawingObject);
            this.canvas.setLayer(this.drawingObject.name ,this.drawingObject).drawLayers()
        }
    },
    on_drawStop: function(event) {
        if (this.drawingObject!=null) {
            console.log(JSON.stringify(this.drawingObject))
            log("videoPlayer:endDrawing:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+this.discussion_id+":"+this.annotation_id+":"+event.x+":"+event.y+":"+this.player.getCurrentTime())
            vD.a(this.drawingObject);
            vD.i(this.annotation_id).saveAnnotation(this.drawingObject.name);
        }
    },
    drawAnnotations: function(array, flag) {
        if (!flag) this.clearAnnotations();
        for (var i in array) {
            var obj = vD.a(array[i]);
            obj.layer = true;
            var newobj = {
                "id": obj.name,
                "discussion_id": obj.data.discussion_id,
                "type": "annotation"
            }
            //console.log(newobj)
            //this.visible_objects[newobj.id]=newobj;
            this.canvas.addLayer(obj).drawLayers();
            //console.log(obj)
            //this.canvas.addLayerToGroup(obj.name, "commentAnnotation")
        }
    },
    clearAnnotations: function() {
        this.canvas.removeLayers();
        this.canvas.clearCanvas();
        //console.log("clearing");
        //console.log(this.visible_objects)
        //console.log(this.canvas.getLayers())

        /*var arr = this.canvas.getLayers();

        for (var i in arr){
            if (((arr[i].data.comment_id!=null) && (arr[i].data.discussion_id!=null)) || (arr[i].data.type!=null)) {
                console.log(arr[i].name)
                //this.canvas.removeLayer(arr[i].name)
            }
            //console.log(arr[i].data);
        }

        this.canvas.drawLayers();

        var arr = this.canvas.getLayers();

        for (var i in arr){

            console.log(arr[i].data);
        } */


        /*for (var i in this.visible_objects) {
            if (this.visible_objects[i]!=null)
            if (this.visible_objects[i].type=="annotation") {
                this.canvas.removeLayer(this.visible_objects[i].id).drawLayers();
                this.visible_objects[i]=null;

            }


        }*/


        //this.canvas.clearCanvas();

        /*try {
            throw new Error("clear")
        } catch (e) {
            console.log(e.stack)
        }*/

    },
    addEmbeddedDrawing: function(layer) {
        this.canvas.addLayer(layer).drawLayers();
    },
    removeEmbeddedDrawing: function(layerID) {
        this.canvas.removeLayer(layerID).drawLayers();

    },
    endAnnotation: function(){
        log("videoPlayer:endAnnotation:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+this.discussion_id+":"+this.annotation_id+":"+this.player.getCurrentTime())
        // DoneDraw from DrawPause to lastMode
        this.interactionElement.switchMode(this.last_mode);
        this.canvas.data({"visible_flag": false});
        this.annotation_id = null
        this.discussion_id = null
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
    contextMenuAddCommentThread: function(event) {
        //console.log($(event.target).parent().parent().offset().left);
        var x = $(event.target).parent().position().left;
        var y = $(event.target).parent().position().top;
        event.stopPropagation();
        var data = {
            "id": this.id+"_addNewCommentThread",
            "video_id": this.id,
            "x": x,
            "y": y,
            "windowName": 'New Discussion Thread',
            "draggable": false,
            "time": this.player.getCurrentTime(),
            "pad": "pad20"
        }
        log("videoPlayer:on_createNewComment:"+this.id.split("_")[0]+":"+this.data.object_data.id+":"+x+":"+y+":"+this.player.getCurrentTime())
        this.contextMenu.on_hide();
        this.windowAddNewComment = new addNewDiscussion(this.element, data);
        // CommentPick from MenuPause to CommentPause
        this.last_mode = this.interactionElement.switchMode("addNewComment");
        this.openedComment();
    },
    contextMenuDebug: function(event) {
        console.log(vD);
        console.log(log_data);
    },

    generalError: function(e) {
        console.error(e.stack);
        console.log(vD);
        log(e.stack.toString());
    },

    close: function() {
        for (var key in this.interval_set) {
            clearInterval(this.interval_set[key]);
            this.interval_set[key]=null;
        }
        this._super();

    }
})