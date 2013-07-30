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
    var video_Player_id = playerId.replace(video_id, "");

    var pre_corrected_Id = playerId;
    for (var i; i<playerId.length; i++) {
        if (playerId[i]=='_') pre_corrected_Id += '1'+i;
        else if (playerId[i]=='-') pre_corrected_Id += '2'+i;
    }
    var corrected_Id = pre_corrected_Id.replace(/\W/g, '');

    try {
        vData.instances[video_Player_id].player.addEventListener("onError", "onPlayerError"+corrected_Id);
        vData.instances[video_Player_id].player.addEventListener("onStateChange", "onStateChange"+corrected_Id);
    } catch (e) {
        throw new Error(e)
    } 

    window["onPlayerError" + corrected_Id] = function(state) {
        //console.log("onPlayerError")
        vData.instances[video_Player_id].on_player_Error(state);
    };

    window["onStateChange" + corrected_Id] = function(state) {
        vData.instances[video_Player_id].on_player_State_Change(state);
    };

    vData.instances[video_Player_id].player.cueVideoId(video_id);
    vData.instances[video_Player_id].player.setPlaybackQuality("default");
    vData.instances[video_Player_id].seekstart();

}

/* video_Player */

var video_Player = function(parent, data, width, sceneflag) {
    this.classType = "video_Player"
    this.parent = parent;
    this.data = data;

	this.width = width;
    this.sceneflag = sceneflag;

    this.start();

}

video_Player.prototype = {
    start: function() {
        if (this.parent!='test') this.init();
        else this.test();
    },

	init: function() {

        this.id = this.data.id
        this.player = null;

        var player_container_class;
        if (!this.sceneflag) player_container_class='player_container'
        else player_container_class='main_player_container'

        this.playerID = this.data.video_data.id+this.id
        this.player_container = save_element(this.parent, "div", this.id+"_container", [player_container_class]);

        var address = "http://www.youtube.com/apiplayer?controls=0"+
                        "&enablejsapi=1"+
                        "&rel=0"+
                        "&showinfo=0"+
                        "&autohide=1"+
                        "&playerapiid="+this.playerID+
                        "&version=3"+
                        "&autoplay=0";

        var element = create_element("object", this.playerID, ["video_player"], {"type":"application/x-shockwave-flash", 
                                                                            "data": address, 
                                                                            "width":this.width,
                                                                            "height": height})

        var param = create_element("param", null, null, {"name":"allowScriptAccess", "value":"always"})
        var param2 = create_element("param", null, null, {"name":"wmode", "value":"opaque"})

        element.appendChild(param);
        element.appendChild(param2);

        this.player_container.append(element);
        
        this.ins.timeline = new timeline_Player(this.player_container, this.id+"_timeline");

        if (this.sceneflag) {
            this.timeline.element.addClass('hide');
            this.timeline.scrubber.addClass('hide'); 
        }

        this.player_area = save_element(this.player_container, "div", this.id+"_area", ["player_area"]);
        this.player_area.css({"width":this.width, "height": height});

        this.player_element = $("object#"+this.id);
        this.player = document.getElementById(this.id);

        this.player_area.click($.proxy(this.on_click, this));

        this.player_area.bind("contextmenu", $.proxy(this.right_click, this));

        this.playerflag=false;
        this.loaded=false;

        this.interval = null;

        this.player_element.data({
            "data":this.data,
            "width": this.width,
            "scenflag": this.sceneflag
        });

        this.contextmenu = new video_contextmenu(this.player_area, this.data.id+"_context_menu", this.data.id);
        
        if (debug) creation_success(this.classType, this.id)
	},

    test: function(){
        var test_code = 0;

        if (test_run) {
            
        }

        return test_code;
    },

    destroy: function(){

        for (var key in this) {
            if (this[key].classType!=null) {
                this[key].destroy();
            }
        }

        this.player_container.empty();

        vData.delete_instance(this.id);
    },

	right_click: function(event) {
        this.contextmenu.setxy(event.offsetX, event.offsetY);
        this.contextmenu.element.removeClass('hide')

        this.pause();
        return false
    },

	on_playing: function() {
		try {
			if (this.player.getPlayerState()==1) {
				this.checkposition();
			}
		} catch(e){
			//console.log(e);
		}
    },

	on_player_State_Change: function(event) {

		if (event=='1') {
			this.playerflag=true;
			this.timeline.timelength = this.player.getDuration();
			this.interval = setInterval($.proxy(this.checkposition, this), 250);
		} else {
			this.playerflag=false;
			clearInterval(this.interval);
		}
		if (event=='5') {
			this.loaded = true;
            this.seekload(this.data.start);
			this.timeline.timelength = this.player.getDuration();
		}
	},

    on_show: function() {
        this.player_container.css('z-index', 11000);
        this.player_area.css('z-index', 11000);
        this.player_element.css('z-index', 11000);
    },

    on_back: function() {
        this.player_container.css('z-index', "-11000");
        this.player_area.css('z-index', "-11000");
        this.player_element.css('z-index', "-11000");
    },

    hide: function() {
        this.player_container.addClass('hide');
        this.player_area.addClass('hide');
        this.player_element.addClass('hide');
    },

    unhide: function() {
        this.player_container.removeClass('hide');
        this.player_area.removeClass('hide');
        this.player_element.removeClass('hide');
    },

	on_player_Error: function(event) {
		//console.log(event);
		//console.log(data.title);
	},

	on_click: function(event) {

        this.contextmenu.element.addClass('hide')

        if (event.target.id==this.player_area.attr('id')){
            
            if (this.sceneflag) {
                console.log(event.offsetX);
                console.log(event.offsetY);

/*!CHANGE PART HERE*/
                if (/*VData.timeline.passable*/ true) {
            		if (this.playerflag) {
            			this.pause();
            		} else {
            			this.play();
            		}
                }
            } else {
                if (this.playerflag) {
                    this.pause();
                } else {
                    this.play();
                } 
            }
        }
	},

    play: function() {
		if (this.loaded){
            if (!this.sceneflag) {
                if (this.video_start!=null) {
                    if (this.player.getCurrentTime()<this.video_start) {
                        this.player.seekTo(this.video_start+0.1, false);
                    }

                }   
            }

			this.player.playVideo();
		} else {
			console.log("not loaded");	
		}     
    },

    pause: function() {
        this.player.pauseVideo();
        
    },

    seek: function(seconds) {
        this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.play();
    },
 
    seekpause: function(seconds) {
    	this.seek(seconds);
		this.pause();	
    },

    seekload: function(seconds) {
    	this.player.stopVideo();
        this.player.seekTo(seconds, false);
        this.player.playVideo();
		this.player.pauseVideo();	
    },

    seekstart: function() {
        this.player.stopVideo();
        this.player.seekTo(this.data.start, false);
        this.player.playVideo();
        this.player.pauseVideo();
    },

    set_start_end: function(start, end) {
        if (!this.sceneflag) {
            this.video_start=start;
            this.video_end=end;
        }
    },


	checkposition: function() {

        if (!this.sceneflag){

            if ((this.video_start!=null) && (this.video_end!=null)) {
                if (this.player.getCurrentTime()<this.video_start) {
                    this.seek(this.video_start)
                } else if (this.player.getCurrentTime()>this.video_end) {
                    this.seekpause(this.video_start)
                }
            }

            var timer = this.player.getCurrentTime();
            this.timeline.updatepos(timer);
                

        } else {

            var vidstart = this.data.start
            var vidend = this.data.end

            /*CHANGE PART HERE*/
            //var index = VData.timeline.timeline_index[this.idnum];

            if (this.player.getCurrentTime()<vidstart) {
                this.seekpause(vidstart);
                this.on_back();
            }
            else if (this.player.getCurrentTime()>vidend){
                this.pause();
                this.on_back();

                var next = this.data.next
                var nextstart = vData.instances[next].data.start
            
                //var next = VData.timeline.timeline[index+1]
                //var nextstart = VData.timeline.timeline_timepts[index+1].video_start
                if (next!=null) {
                	vData.instances[next].on_show();
                	vData.instances[next].seek(nextstart);
                    //VUI.main_VideoPlayer.videoset[next].on_show();
                    //VUI.main_VideoPlayer.videoset[next].seek(nextstart);
                }


            } else {
            	/*CHANGE PART HERE*/
            	vData.global_Timeline.update_timeline(this.data.id, this.player.getCurrentTime());
                //VData.timeline.update_timeline(index, this.player.getCurrentTime());
            }



        }
    }
	
}
