/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 21/8/13
 * Time: 5:19 AM
 * To change this template use File | Settings | File Templates.
 */

var discussionPt = Class.extend({
    init: function(parent, data) {
        this.parent = parent
        this.data = data
        this.id = this.data.id+"_discussionTrigger"
        //console.log("created discussionPt");

        var discussion_trigger = {
            "time": this.data.time,
            "id": this.data.id,
            "video_id": this.data.video_id
        }

        vD.i(this.data.video_id).discussion_pts[this.data.id]=discussion_trigger;
        this.discussionBoxArea = new discussionBoxArea(vD.i(this.data.video_id).discussionAreaBeforeSpace, this.data);
        vD.i(this.discussionBoxArea);

        //if ((vD.i(this.data.video_id).currentTime-3<=this.data.time) && (vD.i(this.data.video_id).currentTime+3>=this.data.time)) {

            this.on_show();
        //}
    },

    updateData: function(data){
        this.data = data;
        if (this.element!=null) {
            this.element.empty();
            this.element.append(this.data.comment_list.length);
        }

        this.discussionBoxArea.updateDiscussion(data);
    },

    on_show: function() {
        var cx = this.data.x - this.data.bBox.width/2 -7;
        var cy = this.data.y - this.data.bBox.height/2 - 7

        this.interactionElementData = {
            "id": this.id+"_area",
            "defaultMode": "normal",
            "class": ["discussionTrigger"],
            "default_return_val": true,
            "css": {
                "top": cy,
                "left": cx,
                "width": 15,
                "height": 15,
                "padding-left": 5,
                "padding-top": 5,
                "background-color": "#93939c",
                "color": "black",
                "font-weight": "bold"
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
        if (this.interactionElement == null) {
            this.interactionElement = new interactionElement(this.parent, this.interactionElementData);
            vD.i(this.interactionElement);
        }

        this.element = this.interactionElement.element
        this.element.empty();
        this.element.append(this.data.comment_list.length);

        //this.element.

        this.discussionBoxArea.on_show();




    },

    setupInteractionElement: function() {
        try {
            if (this.interactionElementData==null) throw new Error ("Setting up of the interactionElementData is not done");

            this.interactionElementData.on_click.normal = $.proxy(this.on_expand, this);
            this.interactionElementData.on_mouseenter.normal = $.proxy(this.on_showbBox, this);

            this.interactionElementData.on_click.expand = $.proxy(this.on_collapse, this);
            //this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);
        } catch (e) {
            this.generalError(e);
        }
    },

    on_showbBox: function() {
        this.interactionBBoxData = {
            "id": this.id+"_interactionbBox",
            "defaultMode": "normal",
            "class": ["discussionBoundingBox"],
            "default_return_val": true,
            "css": {
                "top": this.data.bBox.y,
                "left": this.data.bBox.x,
                "width": this.data.bBox.width,
                "height": this.data.bBox.height
            },
            "on_click": {},
            "right_click": {},
            "on_mousedown": {},
            "on_mousemove": {},
            "on_mouseup": {},
            "on_mouseenter": {},
            "on_mouseleave": {}
        }

        //console.log(this.id)
        this.setupInteractionBBox();
        if (this.interactionBBox == null) {
            this.interactionBBox = new interactionElement(this.parent, this.interactionBBoxData);
            vD.i(this.interactionBBox);
        }

        this.bBoxUI = this.interactionBBox.element;

        this.discussionBoxArea.element.css({"background-color": "#BBBBBB", "color": "#000000"});
    },

    setupInteractionBBox: function() {
        try {
            if (this.interactionBBoxData==null) throw new Error ("Setting up of the interactionElementData is not done");

            this.interactionBBoxData.on_click.normal = $.proxy(this.on_expand, this);
            this.interactionBBoxData.on_mouseleave.normal = $.proxy(this.on_hidebBox, this);

            this.interactionBBoxData.on_click.expand = $.proxy(this.on_collapse, this);
            //this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);
        } catch (e) {
            this.generalError(e);
        }
    },

    on_hidebBox: function() {

        if (this.discussionBoxArea.newCommentInput!=null) {
            if (this.discussionBoxArea.newCommentInput.annotation_flag) {
                return;
            }
        }

        if (this.interactionBBox!= null) {
            this.interactionBBox.close();
            this.interactionBBox = null;
            this.bBoxUI = null
        }
        this.discussionBoxArea.element.css({"background-color": "##777777", "color": "#ffffff"});
        /*if (this.bBoxUI!=null) {
            this.interactionBBox.close();
            this.interactionBBox = null;
            this.bBoxUI = null;
        }*/
    },

    on_expand: function() {
        this.changeOpacity(1);
        this.triggered = true;
        this.interactionBBox.switchMode("expand");
        this.interactionElement.switchMode("expand");
        vD.i(this.data.video_id).openedComment(this);
        vD.i(this.data.video_id).seek(this.data.time, true);
        var data = {
            "id": this.id+"_DiscussionOnVideo",
            "discussion_id": this.id.replace("_discussionTrigger",""),
            "video_id": this.data.video_id,
            "x": this.data.x,
            "y": this.data.y,
            "windowName": 'Discussion Thread',
            "draggable": false,
            "time": this.data.time,
            "pad": "pad20",
            "comment_list": this.data.comment_list
        }

        this.discussionWindow = new discussionOnVideo(this.parent, data)

        this.discussionBoxArea.element.css({"background-color": "#BBBBBB", "color": "#000000"});
    },

    on_collapse: function() {
        if (this.interactionBBox!=null) this.interactionBBox.switchMode("normal");
        if (this.interactionElement!=null) this.interactionElement.switchMode("normal");
        vD.i(this.data.video_id).openedComment(this, true);
        if (this.discussionWindow!=null) {
            console.log(this.discussionWindow)
            if (this.discussionWindow.closeWindow) this.discussionWindow.closeWindow();
            this.discussionWindow = null;
        }
        this.triggered = false;
        this.discussionBoxArea.element.css({"background-color": "##777777", "color": "#ffffff"});
    },

    on_closeWindow: function() {
        if (this.interactionBBox!=null) this.interactionBBox.switchMode("normal");
        this.interactionElement.switchMode("normal");
        vD.i(this.data.video_id).openedComment(this, true);
        this.triggered = false;
    },

    on_hide: function() {
        this.on_collapse();
        this.on_hidebBox();
        if (this.element!=null) {
            this.interactionElement.close();
            this.interactionElement = null;
            this.element = null;
        }
        this.triggered = false;
        this.discussionBoxArea.on_hide();

    },

    changeOpacity: function(val) {
        if (!this.triggered) {
            if (this.bBoxUI!=null) this.bBoxUI.css({"opacity": val});
            if (this.element!=null) this.element.css({"opacity": val});
        }
    }
})

/**
discussionBoxArea ---------------------------------------------------------------------------------------
 */

var discussionBoxArea = Class.extend({
    init: function(prevsibling, data){
        this.prevsibling = prevsibling;
        this.data = data;
        this.id = this.data.id+"_discussionArea"
        this.activeComment = null;
        this.interactionElementList = {};
        this.commentListElements = {};

        console.log(this.id);
        //this.on_show();
    },

    on_show: function(){
        this.interactionElementData = {
            "id": this.id+"_discussionArea",
            "defaultMode": "normal",
            "class": ["discussionAreaCommentBox"],
            "default_return_val": true,
            "css": {
                "padding": 10,
                "background-color": "#777777",
                "color": "white"
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
        if (this.interactionElement == null) {
            this.interactionElement = new interactionElement(this.prevsibling, this.interactionElementData, true);
            vD.i(this.interactionElement);
        }

        this.element = this.interactionElement.element
        this.element.empty();

        for (var i in this.data.comment_list) {
            this.populateElement(i ,this.element, this.data.comment_list[i]);
        }



        //console.log(vD.i(this.data.video_id).discussionArea[0].scrollWidth)

    },

    on_hide: function() {

        //console.log(this.interactionElementList);
        for (var j in this.interactionElementList) {
            if (this.interactionElementList[j]!=null) {
                if (this.interactionElementList[j].close!=null) this.interactionElementList[j].close();
                this.interactionElementList[j]=null;
            }


        }
        this.interactionElementList = {};

        //console.log(this.interactionElementList);
        for (var i in this.commentListElements) {
            if (this.commentListElements[i].close!=null) this.commentListElements[i].close();
            if (this.commentListElements[i].empty!=null) this.commentListElements[i].empty();
            if (this.commentListElements[i].remove!=null) this.commentListElements[i].remove();
            if (this.commentListElements[i]!=null) this.commentListElements[i]=null
        }

        this.commentListElements = {};

        this.element.empty()
        this.element.remove();

        this.interactionElement.close();
        this.interactionElement = null;

    },

    populateElement: function(index, parent, id, margin_left) {

        this.commentListElements[id+"_parent"] = saveElement(
            parent,
            "div",
            id+"_CommentDiscussionAreaParent",
            ["commentDivBox"]
        );

        this.commentListElements[id] = saveElement(
            this.commentListElements[id+"_parent"],
            "div",
            id+"_CommentDiscussionArea",
            ["commentDivArea"]
        );
        //console.log(margin_left)
        this.commentListElements[id].css({"margin-left": margin_left});

        var interactionElementListData = {
            "id": id+"_CommentDiscussionArea",
            "defaultMode": "normal",
            "default_return_val": true,
            "on_click": {},
            "right_click": {},
            "on_mousedown": {},
            "on_mousemove": {},
            "on_mouseup": {},
            "on_mouseenter": {},
            "on_mouseleave": {}
        }

        interactionElementListData = this.setupInteractionListElement(interactionElementListData);

        this.interactionElementList[id] = new interactionExistingElement(this.commentListElements[id],interactionElementListData);

        console.log(this.interactionElementList)
        //vD.i(this.interactionElementList[id]);

        this.commentListElements[id+"_commentEl"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_commentDiscussionAreaEl",
            ["commentEl"]
        )
        var commentEl = this.commentListElements[id+"_commentEl"]

        this.commentListElements[id+"_commentUser"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_commentDiscussionAreaUser",
            ["commentUser"]
        )
        var commentUser = this.commentListElements[id+"_commentUser"]

        this.commentListElements[id+"_commentAdditionalData"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_commentDiscussionAreaAdditionalData",
            ["commentAdditionalData"]
        )
        var commentAdditionalData = this.commentListElements[id+"_commentAdditionalData"]

        var cData = vD.c(id);



        var comment = cData.comment;
        if ($.trim(comment)=="") comment = "&nbsp;";

        commentEl.append(cData.commenter+" says:<br/><br/><br/>"+comment+"<br/><br/><hr/>");
        commentUser.append("Date made: "+cData.timeStamp.toString());
        commentAdditionalData.append("Number of replies: "+cData.comment_list.length);

        if (vD.user == cData.commenter) this.commentListElements[id].css({"background-color": "#009900"});

        this.commentListElements[id+"_oldCommentButtonArea"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_oldDiscussionAreaCommentButtonArea",
            ["oldCommentButtonArea"]
        )
        var oldCommentButtonArea = this.commentListElements[id+"_oldCommentButtonArea"]

        this.commentListElements[id+"_commentReply"] = new buttonClass(
            oldCommentButtonArea,
            "Reply",
            id+"_commentDiscussionAreaReply",
            $.proxy(this.addReply, this, id, this.commentListElements[id+"_oldCommentButtonArea"])
        )

        if (cData.comment_list.length>0) {
            this.commentListElements[id+"_seeDiscussion"] = new buttonClass(
                oldCommentButtonArea,
                "See Discussion",
                id+"_seeDiscussionAreaDiscussion",
                $.proxy(this.seeDiscussion, this, id, this.data.id)
            )
        }

        if (cData.replyTo==null) {
            if (index==0) {
                this.commentListElements[id+"_newDiscussion"] = new buttonClass(
                    oldCommentButtonArea,
                    "New Discussion",
                    id+"_newDiscussionAreaDiscussion",
                    $.proxy(this.newDiscussion, this)
                )
            }
        }

        // put all replies under this...
        this.commentListElements[id+"_commentRepliesArea"] = saveElement(
            parent,
            "div",
            id+"_CommentDiscussionAreaRepliesArea",
            ["commentRepliesDivBox"]
        );

        /*if (cData.replyTo!=null) {
            this.commentListElements[id].hide()
        }

        for (var j in cData.comment_list) {
            this.populateElement(this.commentListElements[id], cData.comment_list[j]);
        }*/

        //var cData = vD.c(data.id);


    },

    setupInteractionElement: function() {
        try {
            if (this.interactionElementData==null) throw new Error ("Setting up of the interactionElementData is not done");

            this.interactionElementData.on_mouseenter.normal = $.proxy(this.on_mouseenter, this);
            this.interactionElementData.on_mouseleave.normal = $.proxy(this.on_mouseleave, this);

            //this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);
        } catch (e) {
            this.generalError(e);
        }
    },

    setupInteractionListElement: function(obj) {
        try {
            if (obj==null) throw new Error ("Setting up of the interactionElementData is not done");

            obj.on_mouseenter.normal = $.proxy(this.on_mouseenterComment, this);
            obj.on_mouseleave.normal = $.proxy(this.on_mouseleaveComment, this);
            obj.on_click.normal = $.proxy(this.on_clickComment, this);


            return obj;
            //this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);
        } catch (e) {
            this.generalError(e);
        }
    },

    on_mouseenter: function(event) {
        console.log("this is enter");
        //console.log(this.id.split("_")[0]+"_discussionTrigger")
        //console.log(vD.i(this.id.split("_")[0]+"_discussionTrigger"))
        //console.log(this.id);
        vD.i(this.id.split("_")[0]+"_discussionTrigger").on_showbBox();
        this.element.css({"background-color": "#999999", "color": "#000000"})
        //vD.i()
    },

    on_mouseleave: function(event) {
        console.log("this is leave");

        if (this.newCommentInput!=null) {
            if (this.newCommentInput.annotation_flag) {
                return;
            }
        }

        this.element.css({"background-color": "##777777", "color": "#ffffff"})
        vD.i(this.id.split("_")[0]+"_discussionTrigger").on_hidebBox();
    },

    on_click: function(event) {
        //console.log(obj)
    },

    on_mouseenterComment: function(event) {
        console.log("comment enter")
        console.log(event.target.id);

        var comment_id = event.target.id.split("_")[0]

        this.drawAnnotation(comment_id)
        // draw annotations
        //vD.i(this.data.video_id).drawAnnotations(cData.annotation_arr);
        //this.commentListElements[event.target.id.split("_")[0]].data({"bground": this.commentListElements[event.target.id.split("_")[0]].css("background-color")}) ;
        //console.log(this.commentListElements[event.target.id.split("_")[0]].css("background-color"));
        this.commentListElements[event.target.id.split("_")[0]].css({"background-color": "#FFFFFF"});

    },

    drawAnnotation: function (comment_id, flag) {
        console.log(comment_id)
        var cData = vD.c(comment_id);
        if (cData==null) return;
        //console.log(cData);
        if (cData.replyTo) this.drawAnnotation(cData.replyTo);
        vD.i(this.data.video_id).drawAnnotations(cData.annotation_arr, true);
    },

    on_mouseleaveComment: function(event) {
        console.log("comment left")
        console.log(event.target.id);

        if (this.newCommentInput!=null) {
            if (this.newCommentInput.annotation_flag) {
                return;
            }
        }
        var cData = vD.c(event.target.id.split("_")[0]);
        var color = "transparent";

        if (cData.commenter == vD.user) color = "#009900";

        this.commentListElements[event.target.id.split("_")[0]].css({"background-color": color});
        vD.i(this.data.video_id).clearAnnotations();
    },

    on_clickComment: function( event) {
        console.log("comment clicked")
        console.log(event.target.id.split("_")[0]);
        console.log(vD.i(this.data.video_id).discussionArea.scrollTop());
        var current_top = vD.i(this.data.video_id).discussionArea.scrollTop()
        var comment_y = this.commentListElements[event.target.id.split("_")[0]].offset().top;
        var disc_y = vD.i(this.data.video_id).discussionArea.offset().top;

        var cData = vD.c(event.target.id.split("_")[0]);
        var dData = vD.d(cData.discussion_id);
        vD.i(dData.video_id).seek(dData.time, true);

        console.log(comment_y);
        console.log(disc_y);
        console.log(comment_y-disc_y)
        //console.log(this.commentListElements[event.target.id.split("_")[0]].position().top-210);
        //var posy = this.commentListElements[event.target.id.split("_")[0]].position().top-210
        //if (posy>10) vD.i(this.data.video_id).discussionArea.animate({"scrollTop" : this.commentListElements[event.target.id.split("_")[0]].position().top-200})
        vD.i(this.data.video_id).discussionArea.animate({"scrollTop": comment_y-disc_y-210+current_top});
    },

    updateCommentThread: function(comment_id) {

        var cData = vD.c(comment_id);
        var replyToCData = vD.c(cData.replyTo)

        this.commentListElements[cData.replyTo+"_commentRepliesArea"].empty();
        this.commentListElements[cData.replyTo+"_commentAdditionalData"].empty();
        this.commentListElements[cData.replyTo+"_commentAdditionalData"].append("Number of replies: "+replyToCData.comment_list.length);

        for (var i=replyToCData.comment_list.length- 1; i>=0; i--) {
            //console.log(this.commentListElements[cData.replyTo].css("margin-left"));
            this.populateElement(i, this.commentListElements[cData.replyTo+"_commentRepliesArea"], replyToCData.comment_list[i],
                parseInt(this.commentListElements[cData.replyTo].css("margin-left"))+15);
        }

    },

    updateDiscussion: function(data) {
        //var cData = vD.c(comment_id);
        this.data = data;
        this.element.empty();

        for (var i in this.data.comment_list) {
            this.populateElement(i, this.element, this.data.comment_list[i]);
        }

    },

    addReply: function(last_commentID, element){
        //console.log(data);
        console.log(this.data.id)
        this.newCommentData = {
            "video_id": this.data.video_id,
            "discussion_id": this.data.id.replace("_DiscussionOnVideo", "").replace("_discussionTrigger", ""),
            "closeWindow": $.proxy(this.closeReplyComment, this),
            "saveComment": $.proxy(this.saveComment, this),
            replyTo: last_commentID
        }

        var parent = null;
        if (last_commentID) {
            parent =  element;
        } else {
            parent = this.element;
            //parent = this.windowContent
        }
        if (this.newCommentInput!=null) this.newCommentInput.close();
        this.newCommentInput = new commentBox(parent, this.newCommentData);

    },

    newDiscussion: function() {
        /*for (var i in this.commentListElements) {
            if (this.commentListElements[i]!=null) {
                if (this.commentListElements[i].close!=null) {
                    this.commentListElements[i].close();
                } else {
                    this.commentListElements[i].empty()
                    this.commentListElements[i].remove()
                }
                this.commentListElements[i] = null;
            }
        }*/

        //this.commentListElements = {}

        this.addReply(null);
    },

    saveComment: function(data){

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
            console.log(obj);
            vD.c(obj);
            // please add comment to discussionArea
            vD.i(data.discussion_id.replace("_discussionTrigger", "")+"_discussionArea").updateCommentThread(data.id)

        }

        vD.saveData();
        this.closeReplyComment()
        //this.closeWindow();
    },

    closeReplyComment: function() {
        this.newCommentInput.close();
        this.newCommentInput = null;
        //this.commentListElements[event.target.id.split("_")[0]].css({"background-color": "transparent"});
        //vD.i(this.data.video_id).clearAnnotations();
        vD.i(this.data.video_id).backToMode();
    },

    allCommentsBackToTransparent: function() {

    },

    seeDiscussion: function(comment_id) {
        var cData = vD.c(comment_id);
        //var replyToCData = vD.c(cData.replyTo)

        this.commentListElements[comment_id+"_commentRepliesArea"].empty();
        this.commentListElements[comment_id+"_commentAdditionalData"].empty();
        this.commentListElements[comment_id+"_commentAdditionalData"].append("Number of replies: "+cData.comment_list.length);

        for (var i=cData.comment_list.length- 1; i>=0; i--) {
            //console.log(this.commentListElements[cData.replyTo].css("margin-left"));
            this.populateElement(i,
                this.commentListElements[comment_id+"_commentRepliesArea"], cData.comment_list[i],
                parseInt(this.commentListElements[comment_id].css("margin-left"))+15);
        }

        this.commentListElements[comment_id+"_seeDiscussion"].update_label("Close Discussion");
        this.commentListElements[comment_id+"_seeDiscussion"].update_proxy($.proxy(this.closeDiscussion, this, comment_id));
    },

    closeDiscussion: function(comment_id) {
        var cData = vD.c(comment_id);
        this.commentListElements[comment_id+"_commentRepliesArea"].empty();
        this.commentListElements[comment_id+"_seeDiscussion"].update_label("See Discussion");
        this.commentListElements[comment_id+"_seeDiscussion"].update_proxy($.proxy(this.seeDiscussion, this, comment_id, this.data.id));
    }


    //on_mouseenter



})

