/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 20/8/13
 * Time: 4:54 PM
 * To change this template use File | Settings | File Templates.
 */

var windowedElement = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
        this.draggable = this.data.draggable
        this.pad = this.data.pad;
        vD.i(this);
    },

    run: function() {
        this.window = saveElement(this.parent, "div", this.id+"_window", ['windowClass']);
        this.window.css({"left": this.data.x, "top": this.data.y});
        this.window.addClass(this.data.class);

        this.windowHandler = saveElement(this.window, "div", this.id+"_windowHandler", ['windowClassHandler']);
        this.windowHandlerTitle = saveElement(this.windowHandler, "div", this.id+"_windowHandlerTitle", ['windowClassHandlerTitle']);
        this.windowHandlerTitle.append(this.data.windowName);

        this.windowHandlerIcons =saveElement(this.windowHandler, "div", this.id+"_windowHandlerIcons", ['windowClassHandlerIcons']);
        this.windowExit = new buttonIcon(this.windowHandlerIcons, 'ui-icon-circle-close', this.id+"_windowHandlerExit", "Exit", $.proxy(this.closeFromWindow, this));
        this.windowExit.element.addClass('windowHandlerExitIcon');

        if (this.draggable) {
            // add draggable function here
            this.window.draggable(this.scrubber_fx);
        }

        this.windowContent = saveElement(this.window, "div", this.id+"_windowContent", ["windowContent", this.pad]);

    },

    closeFromWindow: function() {
        log("windowedElement:closeWindow:"+this.id.split("_")[0])
        this.closeWindow();
    },

    closeWindow: function() {

        this.close();

        /*try {
            throw new Error("hey")
        } catch(e) {
            console.log(e.stack)
        }*/
    },

    setxy: function(x,y){
        this.data.x = x;
        this.data.y = y;
        this.window.css({"left": this.data.x, "top": this.data.y});
    },

    scrubber_fx: {
        containment: 'parent',
        cursor: 'pointer',
        start: function() {

        },
        drag: function(){

        },
        stop: function() {
            log("windowedElement:moveWindow:"+this.id.split("_")[0])
        }
    }
});

var addNewDiscussion = windowedElement.extend({
    init: function(parent, data) {
        this._super(parent, data);
        this.run();
    },

    run: function(){
        this._super();

        do {
            var new_id = makeID(global_id_length-2);
        } while (vD.d(new_id)!=null);

        this.data.discussion_id = new_id;

        if (this.data.bBox==null) {
            this.data.bBox = {
                "id": this.data.discussion_id+"_bBox",
                "width": 100,
                "height": 100,
                "x": this.data.x-50,
                "y": this.data.y-50
            }
        }
        //console.log(this.data);
        this.bBoxUI_temp = saveElement(this.parent, "div", this.data.bBox.id, ["discussionBoundingBox"]);
        this.bBoxUI_temp.css(
            {
                "width": this.data.bBox.width,
                "height": this.data.bBox.height,
                "left": this.data.bBox.x,
                "top": this.data.bBox.y
            }
        )

        this.setxy(this.data.bBox.x+this.data.bBox.width, this.data.bBox.y+this.data.bBox.height);

        this.newCommentData = {
            "video_id": this.data.video_id,
            "discussion_id": new_id,
            "closeWindow": $.proxy(this.closeWindow, this),
            "saveComment": $.proxy(this.saveComment, this),
            replyTo: null
        }

        this.element = new commentBox(this.windowContent, this.newCommentData);

    },

    closeWindow: function(){
        vD.i(this.data.video_id).clearAnnotations();
        vD.i(this.data.video_id).backToMode();
        this._super();

    },

    saveComment: function(data) {
        //console.log(data);
        log("addNewDiscussion:saveComment:"+this.newCommentData.discussion_id+":"+data.id+":"+data.replyTo)
        var comment_id = data.id

        var discussion_data = {
            "time": this.data.time,
            "id": this.newCommentData.discussion_id,
            "comment_list": [comment_id],
            "video_id": this.data.video_id,
            "x": this.data.x,
            "y": this.data.y,
            "bBox": this.data.bBox
        }

        var discussion_trigger = {
            "time": this.data.time,
            "id": this.newCommentData.discussion_id,
            "video_id": this.data.video_id
        }

        var discussion_trigger_bar = {
            "id": this.newCommentData.discussion_id,
            "video_id": this.data.video_id,
            "begin": this.data.time,
            "end": null
        }

        vD.c(data);
        vD.d(discussion_data);
        vD.dt(this.data.video_id, discussion_trigger);
        vD.i("mainTimeline").trigger_bars(discussion_trigger_bar, null, "#FF0000")
        // create both discussionthreads and discussionpts
        vD.i(new discussionPt(this.parent, discussion_data));

        vD.saveData();
        this.closeWindow();
    }

})

var discussionOnVideo = windowedElement.extend({
    init: function(parent, data){
        this._super(parent, data);
        this.commentListElements = {};
        this.run();
    },

    run: function(){
        this._super();
        //console.log(this.data);

        for (var i in this.data.comment_list) {
            this.commentListElements[this.data.comment_list[i]] = saveElement(
                this.windowContent,
                "div",
                this.data.comment_list[i]+"_CommentOnVideo",
                ["commentDivArea"]
            );

            this.commentListElements[this.data.comment_list[i]+"_commentEl"] = saveElement(
                this.commentListElements[this.data.comment_list[i]],
                "div",
                this.data.comment_list[i]+"_commentEl",
                ["commentEl"]
            )
            var commentEl = this.commentListElements[this.data.comment_list[i]+"_commentEl"]

            this.commentListElements[this.data.comment_list[i]+"_commentUser"] = saveElement(
                this.commentListElements[this.data.comment_list[i]],
                "div",
                this.data.comment_list[i]+"_commentUser",
                ["commentUser"]
            )
            var commentUser = this.commentListElements[this.data.comment_list[i]+"_commentUser"]

            this.commentListElements[this.data.comment_list[i]+"_commentAdditionalData"] = saveElement(
                this.commentListElements[this.data.comment_list[i]],
                "div",
                this.data.comment_list[i]+"_commentAdditionalData",
                ["commentAdditionalData"]
            )
            var commentAdditionalData = this.commentListElements[this.data.comment_list[i]+"_commentAdditionalData"]

            var cData = vD.c(this.data.comment_list[i]);

            // draw annotations
            vD.i(this.data.video_id).drawAnnotations(cData.annotation_arr);

            var comment = cData.comment;
            if ($.trim(comment)=="") comment = "&nbsp;";

            commentEl.append("<b>"+cData.commenter+"</b> says:<br/>"+comment+"<hr/>");
            commentUser.append("Date made: "+cData.timeStamp.toString());
            commentAdditionalData.append("Number of replies: "+cData.comment_list.length);

            this.commentListElements[this.data.comment_list[i]+"_oldCommentButtonArea"] = saveElement(
                this.commentListElements[this.data.comment_list[i]],
                "div",
                this.data.comment_list[i]+"_oldCommentButtonArea",
                ["oldCommentButtonArea"]
            )
            var oldCommentButtonArea = this.commentListElements[this.data.comment_list[i]+"_oldCommentButtonArea"]

            this.commentListElements[this.data.comment_list[i]+"_commentReply"] = new buttonClass(
                oldCommentButtonArea,
                "Reply",
                this.data.comment_list[i]+"_commentReply",
                $.proxy(this.addReply, this, this.data.comment_list[i])
            )

            if (cData.comment_list.length>0) {
                this.commentListElements[this.data.comment_list[i]+"_seeDiscussion"] = new buttonClass(
                    oldCommentButtonArea,
                    "See Discussion",
                    this.data.comment_list[i]+"_seeDiscussion",
                    $.proxy(this.seeDiscussion, this, this.data.comment_list[i], this.data.id)
                )
            }

            if (i==0) {
                this.commentListElements[this.data.comment_list[i]+"_newDiscussion"] = new buttonClass(
                    oldCommentButtonArea,
                    "New Discussion",
                    this.data.comment_list[i]+"_newDiscussion",
                    $.proxy(this.newDiscussion, this)
                )
            }

        }
        //this.element = saveElement();
    },

    addReply: function(last_commentID){
        log("discussionOnVideo:addReply:"+this.id.split("_")[0]+":"+last_commentID)
        //console.log(this.data.id)
        this.newCommentData = {
            "video_id": this.data.video_id,
            "discussion_id": this.data.id.replace("_DiscussionOnVideo", "").replace("_discussionTrigger", ""),
            "closeWindow": $.proxy(this.closeWindow, this),
            "saveComment": $.proxy(this.saveComment, this),
            replyTo: last_commentID
        }

        var parent = null;
        if (last_commentID) {
            parent =  this.commentListElements[last_commentID];
        } else {
            parent = this.windowContent
        }
        this.element = new commentBox(parent, this.newCommentData);
    },

    seeDiscussion: function(commentID, discussionID) {
        log("discussionOnVideo:seeDiscussion:"+this.id.split("_")[0]+":"+commentID)
        var cData = vD.c(commentID);
        //console.log(discussionID)
        vD.i(discussionID.split("_")[0]+"_discussionArea").seeDiscussion(commentID);
    },

    newDiscussion: function() {
        for (var i in this.commentListElements) {
            if (this.commentListElements[i]!=null) {
                if (this.commentListElements[i].close!=null) {
                    this.commentListElements[i].close();
                } else {
                    this.commentListElements[i].empty()
                    this.commentListElements[i].remove()
                }
                this.commentListElements[i] = null;
            }
        }

        this.commentListElements = {}

        this.addReply(null);
    },

    saveComment: function(data){
        log("discussionOnVideo:saveComment:"+data.discussion_id+":"+data.id+":"+data.replyTo)
        vD.c(data);
        //console.log(data)
        //console.log(data.discussion_id)
        if (data.replyTo==null) {
            var obj = vD.d(data.discussion_id.replace("_discussionTrigger",""))
            obj.comment_list.push(data.id);
            vD.d(obj);
            // update elements
            vD.i(data.discussion_id+"_discussionTrigger").updateData(obj);
        } else {
            var obj = vD.c(data.replyTo)
            obj.comment_list.push(data.id);
            //console.log(obj);
            vD.c(obj);
            // please add comment to discussionArea
            vD.i(data.discussion_id.replace("_discussionTrigger", "")+"_discussionArea").updateCommentThread(data.id)

        }
        vD.saveData();
        this.closeWindow();
    },

    closeWindow: function(){
        //console.log(this.data.id);
        vD.i(this.data.video_id).clearAnnotations();
        vD.i(this.data.video_id).backToMode();
        vD.i(this.id.split("_")[0]+"_discussionTrigger").on_hidebBox();
        vD.i(this.data.id.replace("_DiscussionOnVideo", "")).on_closeWindow();
        this._super();
    }

})

var commentVideo = windowedElement.extend({
    init: function(parent, data){
        this._super(parent, data);
        //this.commentListElements = {};
        this.run();
    },

    run: function() {
        this._super();

        if (this.video==null) {
            //this.element = saveElement(this.windowContent, "div", this.id+"_enter");
            //this.element.css(this.css);
            //console.log(this.data.object_data);
            this.video = new videoPlayer(this.windowContent, this.data.object_data, this.data.object_data.width, false);
            vD.i(this.video);
        }
    },

    closeWindow: function(){
        if (this.video==null) return
        this.video.close();
        this.video = null;
       // this.element.remove();
        //this.element = null;
        this._super();

    }
})
