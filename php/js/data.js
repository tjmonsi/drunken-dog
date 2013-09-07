/**
 * Created with JetBrains PhpStorm.
 * User: tjmonsi
 * Date: 6/9/13
 * Time: 11:35 PM
 * To change this template use File | Settings | File Templates.
 */


"use strict";

var dataModel = Class.extend({
    init: function(parent, id, data) {
        this.parent = parent;
        this.id = id;
        this.data = data;

        this.data_main = null;
        this.data_other = null;
        this.comment_data1 = null;
        this.comment_data2 = null;
        this.video1 = null;
        this.video2 = null;

        this.main_data_array = {};
        this.other_data_array = {};

        this.overall_set = {};

    },

    run: function(data_main, data_other, video1, video2, comment_data1, comment_data2) {

        this.data_main = data_main;
        this.data_other = data_other;
        this.video1 = video1;
        this.video2 = video2;
        this.comment_data1 = comment_data1;
        this.comment_data2 = comment_data2;

        this.mainAnalyze();
        this.otherAnalyze();

        this.printData();

    },

    mainAnalyze: function() {

        var array1 = this.data.logMainViewer;
        this.data_array = {};
        this.data_array.id = this.id;
        var prevTime = null;
        var checkForNext = false;
        var discussionInterestTime = null;
        var commentInterestTime = null;
        var discussionAreaFlag = false
        var seeDiscussionFlag = false;
        var commentFlag = null;
        var mainVideo = {};
        var subVideo = {};


        for (var vals in array1) {
            var array2 = array1[vals].data.split(":");
            var Dtimestamp = array1[vals].timestamp.split("T");

            var Ddate = Dtimestamp[0];
            var Dtime = Dtimestamp[1].split(":");
            var Dhour = parseInt(Dtime[0]);
            var Dmin = parseInt(Dtime[1]);
            var Dsec = parseFloat(Dtime[2].split("Z")[0])

            var Data_time = (Dhour*60*60) + (Dmin*60) + Dsec;


            var objtype = array2[0];
            var interactionType = array2[1];

            /*if (interestTime!=null) {
                if (data_array.discussionInterest == null) {
                    data_array.discussionInterest = 0;
                }
                data_array.discussionInterest += (Data_time - interestTime);
                interestTime=null;
            }*/

            if (objtype=="inVNCBLE") {
                if (interactionType=="start") {
                    this.data_array.startTime = Data_time;
                    this.data_array.significant_interaction = 0;
                    this.data_array.discussionInterest = 0;
                    this.data_array.commentInterest = 0;
                    this.data_array.accumulatedMainVideoTime = 0;
                    this.data_array.accumulatedOtherVideoTime = 0;
                    //this.data_array.mainVideoCurrentTime = 0;
                    this.data_array.mainrewindNumber = 0;
                    this.data_array.mainffNumber = 0;
                    this.data_array.subrewindNumber = 0;
                    this.data_array.subffNumber = 0;
                    this.data_array.mainVideoPause = 0;
                    this.data_array.accumulatedAllVideoTime = 0;
                    this.data_array.timesCorrect = 0;
                    this.data_array.timesWrong = 0;
                    this.data_array.timesRetry = 0;
                    this.data_array.timesNext = 0;
                    this.data_array.commentsHovered = 0;
                    this.data_array.discussionsHovered = 0;

                } else if (interactionType=="end") {
                    this.data_array.endTime = Data_time;
                    this.data_array.experiment_length = this.data_array.endTime - this.data_array.startTime;

                } else {
                    this.uncaught(objtype+":"+interactionType);
                }
            }
            else if (objtype=="discussionPt") {

                this.data_array.discussionsHovered += 1

                if (interactionType=="on_showbBox") {
                    this.data_array.significant_interaction += 1;
                    discussionInterestTime = this.checkDiscussionTime(discussionInterestTime, Data_time);
                } else if (interactionType=="on_expand") {

                    this.data_array.significant_interaction += 1;

                } else {
                    this.uncaught(objtype+":"+interactionType);
                }

            }
            else if (objtype=="discussionBoxArea") {



                if (interactionType=="on_mouseenter") {
                    this.data_array.discussionsHovered += 1
                    this.other_data_array.significant_interaction += 1;

                    discussionInterestTime = this.checkDiscussionTime(discussionInterestTime, Data_time);
                    discussionAreaFlag = true;

                } else if (interactionType=="on_mouseenterComment") {

                    this.data_array.commentsHovered += 1;
                    this.other_data_array.significant_interaction += 1;
                    //console.log(commentInterestTime)
                    commentInterestTime = this.checkCommentTime(commentInterestTime, Data_time, discussionAreaFlag);

                    if (discussionAreaFlag) {
                        discussionAreaFlag = false;
                    }

                    if (commentFlag==null) {
                        commentFlag=array2[3];
                    } else {
                        // do something with previous comment;


                        commentFlag=array2[3];

                    }

                } else if (interactionType=="seeDiscussion") {

                    this.data_array.significant_interaction += 1;
                    seeDiscussionFlag = true;

                } else if (interactionType=="addReply") {

                    this.data_array.significant_interaction += 1;
                    seeDiscussionFlag = true;

                } else if (interactionType=="on_clickComment") {

                    if (commentFlag!=null) {
                        // see comment here
                    }


                    this.data_array.significant_interaction += 1;


                } else {
                    this.uncaught(objtype+":"+interactionType);
                }

            }
            else if (objtype=="videoPlayer") {

                this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;


                var video_id = array2[2];
                var yt_id = array2[3];

                if (interactionType=="on_mousedown") {

                    this.data_array.significant_interaction += 1;

                }
                else if (interactionType=="play") {

                    var video_time = array2[4];

                    if (this.checkVideo(video_id)=="scene") {



                        if (mainVideo[video_id]== null) {
                            mainVideo[video_id] = {};
                            mainVideo[video_id].video_endTime = parseFloat(video_time);
                        }

                        if (mainVideo[video_id].video_endTime > parseFloat(video_time)) {

                            this.data_array.mainrewindNumber += 1;

                        } else if ((mainVideo[video_id].video_endTime == parseFloat(video_time) || (mainVideo[video_id].video_endTime+0.5 >= parseFloat(video_time)))) {

                        } else if (mainVideo[video_id].video_endTime+0.5 < parseFloat(video_time)) {

                            this.data_array.mainffNumber += 1;

                        }

                        if (mainVideo[video_id].startTime == null) {
                            mainVideo[video_id].startTime = Data_time;
                        } else {
                            var timelength = Data_time - mainVideo[video_id].startTime
                            this.data_array.accumulatedMainVideoTime += timelength;
                            mainVideo[video_id].startTime = Data_time;
                        }

                        //console.log("Start:"+mainVideo[video_id].startTime)

                    }
                    else if (this.checkVideo(video_id)=="not scene") {

                        if (subVideo[video_id]== null) {
                            subVideo[video_id] = {};
                            subVideo[video_id].video_endTime = parseFloat(video_time);
                        }

                        if (subVideo[video_id].video_endTime > parseFloat(video_time)) {

                            this.data_array.mainrewindNumber += 1;

                        } else if ((subVideo[video_id].video_endTime == parseFloat(video_time) || (subVideo[video_id].video_endTime+0.5 >= parseFloat(video_time)))) {

                        } else if (subVideo[video_id].video_endTime+0.5 < parseFloat(video_time)) {

                            this.data_array.mainffNumber += 1;

                        }


                        if (subVideo[video_id].startTime == null) {
                            subVideo[video_id].startTime = Data_time;
                        } else {
                            var timelength = Data_time - subVideo[video_id].startTime
                            this.data_array.accumulatedOtherVideoTime += timelength;
                            subVideo[video_id].startTime = Data_time;
                        }

                    }

                }
                else if (interactionType=="pause") {

                    var video_time = array2[4];

                    if (this.checkVideo(video_id)=="scene") {

                        //console.log("End:"+Data_time);

                        if (mainVideo[video_id]== null) {
                            mainVideo[video_id] = {};
                            mainVideo[video_id].video_endTime = parseFloat(video_time);
                        } else {
                            mainVideo[video_id].video_endTime = parseFloat(video_time);
                        }

                        if (mainVideo[video_id].startTime != null) {
                            var timelength = Data_time - mainVideo[video_id].startTime
                            //console.log("Timelength:"+ timelength);
                            this.data_array.accumulatedMainVideoTime += timelength;
                            mainVideo[video_id].startTime = null;
                        }

                        this.data_array.mainVideoPause += 1;

                    } else if (this.checkVideo(video_id)=="not scene") {

                        if (subVideo[video_id]== null) {
                            subVideo[video_id] = {};
                            subVideo[video_id].video_endTime = parseFloat(video_time);
                        } else {
                            subVideo[video_id].video_endTime = parseFloat(video_time);
                        }

                        if (subVideo[video_id].startTime != null) {
                            var timelength = Data_time - subVideo[video_id].startTime
                            this.data_array.accumulatedOtherVideoTime += timelength;
                            subVideo[video_id].startTime = null;
                        }

                    }

                }

                else if (interactionType=="on_createNewComment") {


                }
                else if (interactionType=="right_click") {


                }
                else if (interactionType=="cancelComment") {


                }
                else {
                    this.uncaught(objtype+":"+interactionType);
                }

            }
            else if (objtype=="windowedElement") {

                /*this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;*/


                if (interactionType == "moveWindow") {

                } else if (interactionType == "closeWindow") {

                    this.data_array.significant_interaction += 1;

                } else {
                    this.uncaught(objtype+":"+interactionType);
                }

            }
            else if (objtype=="embeddedSubmit") {

                this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;



                if (interactionType == "all_correct") {
                    this.data_array.significant_interaction += 1;
                    this.data_array.timesCorrect += 1;

                }
                else if (interactionType == "some_wrong") {
                    this.data_array.significant_interaction += 1;
                    this.data_array.timesWrong += 1;

                }
                else if (interactionType == "go_retry") {
                    this.data_array.significant_interaction += 1;
                    this.data_array.timesRetry += 1;

                }
                else if (interactionType == "go_on_next") {
                    this.data_array.significant_interaction += 1;
                    this.data_array.timesNext += 1;

                }
                else if (interactionType == "check_ans") {

                    this.data_array.significant_interaction -= 1;

                } else {

                    this.uncaught(objtype+":"+interactionType);

                }

            }
            else if (objtype=="embeddedButton") {

                this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;

                if (interactionType == "did_trigger") {

                    this.data_array.significant_interaction += 1;
                } else {

                this.uncaught(objtype+":"+interactionType);

                }

            }
            else if (objtype=="mainTimeline") {

                this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;

                if (interactionType == "timeline_click") {

                    this.data_array.significant_interaction += 1;

                }
                else if (interactionType == "start_scrub") {

                    var video_id = array2[2];

                    if (mainVideo[video_id].startTime != null) {
                        var timelength = Data_time - mainVideo[video_id].startTime
                        //console.log("Timelength:"+ timelength);
                        this.data_array.accumulatedMainVideoTime += timelength;
                        mainVideo[video_id].startTime = null;
                    }

                    this.data_array.mainVideoPause += 1;


                } else if (interactionType == "stop_scrub") {

                    this.data_array.significant_interaction += 1;

                }
                else {

                    this.uncaught(objtype+":"+interactionType);

                }

            }
            else if (objtype=="discussionOnVideo") {

                this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;

                if (interactionType == "seeDiscussion") {

                    this.data_array.significant_interaction += 1;
                    discussionInterestTime = this.checkDiscussionTime(discussionInterestTime, Data_time);

                } else {

                    this.uncaught(objtype+":"+interactionType);

                }

            }
            else if (objtype=="commentBox") {

                this.checkDiscussionTime(discussionInterestTime, Data_time);
                discussionInterestTime = null;
                this.checkCommentTime(commentInterestTime, Data_time);
                commentInterestTime = null;

                if (interactionType == "cancelNewComment") {


                } else {

                    this.uncaught(objtype+":"+interactionType);

                }

            }
            else {
                this.uncaught(objtype);
            }

            prevTime = Data_time;

        }


        this.data_array.accumulatedAllVideoTime = this.data_array.accumulatedMainVideoTime + this.data_array.accumulatedOtherVideoTime;
        this.data_array.accumulatedOtherStuff = this.data_array.experiment_length - this.data_array.accumulatedMainVideoTime;

        var c = 0;
        for (var i in subVideo) {
            c += 1;
        }
        //console.log("subVideos watched:"+c);
        this.data_array.subVideosWatched = c;


        this.data_array.type = "main";
        delete this.data_array['startTime'];
        delete this.data_array['endTime'];
        //this.data_array = data_array;
        console.log(this.data_array);
    },

    checkCommentTime: function(commentInterestTime, Data_time, discussionAreaFlag) {
        if (commentInterestTime==null) {
            return Data_time;
        } else {
            var timelength = (Data_time - commentInterestTime);
            //console.log(timelength)
            if (timelength>1) {
                this.data_array.commentInterest += (Data_time - commentInterestTime);

            }
            return null;
        }
    },

    checkDiscussionTime: function(discussionInterestTime, Data_time) {
        if (discussionInterestTime==null) {
            return Data_time;
        } else {
            var timelength = (Data_time - discussionInterestTime);
            if (timelength>1) {
                this.data_array.discussionInterest += timelength;
                this.data_array.significant_interaction += 1;
            }
            return null;
        }
    },

    checkVideo: function(video_id) {

        for (var key in this.data_main.data.scene_objects) {
            if (video_id == this.data_main.data.scene_objects[key].id) {
                return "scene"
            }
        }

        return "not scene"

    },

    otherAnalyze: function() {
        var array1 = this.data.logOtherViewer;
        this.other_data_array = {};
        this.other_data_array.id = this.id;
        var prevTime = null;
        var checkForNext = false;
        var discussionInterestTime = null;
        var commentInterestTime = null;
        var discussionAreaFlag = false
        var seeDiscussionFlag = false;
        var commentFlag = null;
        var mainVideo = {};
        var subVideo = {};


        for (var vals in array1) {
            var array2 = array1[vals].data.split(":");
            var Dtimestamp = array1[vals].timestamp.split("T");

            var Ddate = Dtimestamp[0];
            var Dtime = Dtimestamp[1].split(":");
            var Dhour = parseInt(Dtime[0]);
            var Dmin = parseInt(Dtime[1]);
            var Dsec = parseFloat(Dtime[2].split("Z")[0])

            var Data_time = (Dhour*60*60) + (Dmin*60) + Dsec;


            var objtype = array2[0];
            var interactionType = array2[1];

            /*if (interestTime!=null) {
             if (data_array.discussionInterest == null) {
             data_array.discussionInterest = 0;
             }
             data_array.discussionInterest += (Data_time - interestTime);
             interestTime=null;
             }*/

            if (objtype=="otherInterface") {
                if (interactionType=="start") {
                    this.other_data_array.startTime = Data_time;
                    this.other_data_array.significant_interaction = 0;
                    this.other_data_array.discussionInterest = 0;
                    this.other_data_array.commentInterest = 0;
                    this.other_data_array.accumulatedMainVideoTime = 0;
                    this.other_data_array.accumulatedOtherVideoTime = 0;
                    //this.data_array.mainVideoCurrentTime = 0;
                    this.other_data_array.mainrewindNumber = 0;
                    this.other_data_array.mainffNumber = 0;
                    this.other_data_array.subrewindNumber = 0;
                    this.other_data_array.subffNumber = 0;
                    this.other_data_array.mainVideoPause = 0;
                    this.other_data_array.accumulatedAllVideoTime = 0;
                    this.other_data_array.timesCorrect = 0;
                    this.other_data_array.timesWrong = 0;
                    this.other_data_array.timesRetry = 0;
                    this.other_data_array.timesNext = 0;
                    this.other_data_array.commentsHovered = 0;
                    this.other_data_array.discussionsHovered = 0;

                } else if (interactionType=="end") {
                    this.other_data_array.endTime = Data_time;
                    this.other_data_array.experiment_length = this.other_data_array.endTime - this.other_data_array.startTime;

                } else {
                    this.uncaught(objtype+":"+interactionType);
                }

            }
            else if (objtype=="navBarObj")  {

                if (interactionType == "showSet") {



                    //this.other_data_array.significant_interaction += 1;

                } else if (interactionType == "hideSet") {

                    //console.log(array2);
                    var video_id = array2[2];
                    if (mainVideo[video_id] != null)
                        if (mainVideo[video_id].startTime != null) {
                            var timelength = Data_time - mainVideo[video_id].startTime
                            //console.log("Timelength:"+ timelength);
                            this.other_data_array.accumulatedMainVideoTime += timelength;
                            mainVideo[video_id].startTime = null;
                        }
                    //this.other_data_array.significant_interaction += 1;

                }


                else if (interactionType == "on_click") {

                    this.other_data_array.significant_interaction += 1;

                }
                else if (interactionType == "on_mouseenter") {

                } else {
                    this.uncaught(objtype+":"+interactionType)
                }
            }
            else if (objtype=="videoPlayer")  {

                if (interactionType == "play") {

                    var video_id = array2[2];
                    var video_time = array2[4];

                    if (mainVideo[video_id]== null) {
                        mainVideo[video_id] = {};
                        mainVideo[video_id].video_endTime = parseFloat(video_time);
                    }

                    if (mainVideo[video_id].video_endTime > parseFloat(video_time)) {

                        this.other_data_array.mainrewindNumber += 1;

                    } else if ((mainVideo[video_id].video_endTime == parseFloat(video_time) || (mainVideo[video_id].video_endTime+0.5 >= parseFloat(video_time)))) {

                    } else if (mainVideo[video_id].video_endTime+0.5 < parseFloat(video_time)) {

                        this.other_data_array.mainffNumber += 1;

                    }

                    if (mainVideo[video_id].startTime == null) {
                        mainVideo[video_id].startTime = Data_time;
                    } else {
                        var timelength = Data_time - mainVideo[video_id].startTime
                        this.other_data_array.accumulatedMainVideoTime += timelength;
                        mainVideo[video_id].startTime = Data_time;
                    }

                }
                else if (interactionType == "pause") {

                    var video_id = array2[2];
                    var video_time = array2[4];

                    if (mainVideo[video_id]== null) {
                        mainVideo[video_id] = {};
                        mainVideo[video_id].video_endTime = parseFloat(video_time);
                    } else {
                        mainVideo[video_id].video_endTime = parseFloat(video_time);
                    }

                    if (mainVideo[video_id].startTime != null) {
                        var timelength = Data_time - mainVideo[video_id].startTime
                        //console.log("Timelength:"+ timelength);
                        this.other_data_array.accumulatedMainVideoTime += timelength;
                        mainVideo[video_id].startTime = null;
                    }

                    this.other_data_array.mainVideoPause += 1;


                }
                else {
                    this.uncaught(objtype+":"+interactionType)
                }

            }
            else if (objtype=="quizObj")  {

                if (interactionType == "allCorrect") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.timesCorrect += 1;

                }
                else if (interactionType == "Retry") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.timesRetry += 1;


                }
                else if (interactionType == "someWrong") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.timesWrong += 1;


                }
                else if (interactionType == "Continue") {

                    //this.other_data_array.significant_interaction += 1;

                }
                else if (interactionType == "on_next") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.mainffNumber += 1;

                }
                else if (interactionType == "on_prev") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.mainrewindNumber += 1;

                }

                else {
                    this.uncaught(objtype+":"+interactionType)
                }

            }
            else if (objtype=="commentThread")  {

                if (interactionType == "on_mouseenter") {
                    this.other_data_array.discussionsHovered += 1
                    this.other_data_array.significant_interaction += 1;

                } else if (interactionType == "on_mouseleave") {


                } else if (interactionType == "on_mouseenterComment") {

                    this.other_data_array.commentsHovered += 1;
                    this.other_data_array.significant_interaction += 1;

                }
                else if (interactionType == "seeDiscussion") {

                    this.other_data_array.significant_interaction += 1;

                }
                else if (interactionType == "on_clickComment") {

                    this.other_data_array.significant_interaction += 1;

                }
                else if (interactionType == "addReply") {

                    //this.other_data_array.significant_interaction += 1;

                }

                else {
                    this.uncaught(objtype+":"+interactionType)
                }

            }
            else if (objtype=="sceneObj")  {
                if (interactionType == "on_mouseenter") {


                }
                else if (interactionType == "on_next") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.mainffNumber += 1;

                }
                else if (interactionType == "on_prev") {

                    this.other_data_array.significant_interaction += 1;
                    this.other_data_array.mainrewindNumber += 1;

                }
                else {
                    this.uncaught(objtype+":"+interactionType)
                }
            }
            else if (objtype=="commentBox") {

                if (interactionType == "cancelNewComment") {


                } else {

                    this.uncaught(objtype+":"+interactionType);

                }

            }
            else {
                this.uncaught(objtype)
            }
        }

        this.other_data_array.accumulatedOtherStuff = this.other_data_array.experiment_length - this.other_data_array.accumulatedMainVideoTime;

        this.other_data_array.type = "other";
        delete this.other_data_array['startTime'];
        delete this.other_data_array['endTime'];
        console.log(this.other_data_array);

    },

    printData: function() {

        $("#TotalTimeUsed").append("<tr><th>"+this.id+"</th><th>"+this.data_array.experiment_length+"</th><th>"+this.other_data_array.experiment_length+"</th></tr>");

        $("#AccumulatedMainVideo").append("<tr><th>"+this.id+"</th><th>"+this.data_array.accumulatedMainVideoTime+"</th><th>"+this.other_data_array.accumulatedMainVideoTime+"</th></tr>");

        $("#AccumulatedNonVideo").append("<tr><th>"+this.id+"</th><th>"+this.data_array.accumulatedOtherStuff+"</th><th>"+this.other_data_array.accumulatedOtherStuff+"</th></tr>");

        $("#DiscussionsHovered").append("<tr><th>"+this.id+"</th><th>"+this.data_array.discussionsHovered+"</th><th>"+this.other_data_array.discussionsHovered+"</th></tr>");

        $("#Interactions").append("<tr><th>"+this.id+"</th><th>"+this.data_array.significant_interaction+"</th><th>"+this.other_data_array.significant_interaction+"</th></tr>");

        $("#CommentsHovered").append("<tr><th>"+this.id+"</th><th>"+this.data_array.commentsHovered+"</th><th>"+this.other_data_array.commentsHovered+"</th></tr>");

        $("#Review").append("<tr><th>"+this.id+"</th><th>"+this.data_array.mainrewindNumber+"</th><th>"+this.other_data_array.mainrewindNumber+"</th></tr>");

        $("#Skip").append("<tr><th>"+this.id+"</th><th>"+this.data_array.mainffNumber+"</th><th>"+this.other_data_array.mainffNumber+"</th></tr>");


    },


    uncaught: function(val) {
        if (val=="TypeError") return;
        console.error("Uncaught value: "+val);
    }

})