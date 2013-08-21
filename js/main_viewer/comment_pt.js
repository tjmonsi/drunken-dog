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
        this.on_show();
    },

    updateData: function(data){
        this.data = data;
        if (this.element!=null) {
            this.element.empty();
            this.element.append(this.data.comment_list.length);
        }
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
            "id": this.id+"_bBox",
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
        this.setupInteractionBBox();
        if (this.interactionBBox == null) {
            this.interactionBBox = new interactionElement(this.parent, this.interactionBBoxData);
            vD.i(this.interactionBBox);
        }

        this.bBoxUI = this.interactionBBox.element;
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
        if (this.bBoxUI!=null) {
            this.interactionBBox.close();
            this.interactionBBox = null;
            this.bBoxUI = null;
        }
    },

    on_expand: function() {
        this.changeOpacity(1);
        this.triggered = true;
        this.interactionBBox.switchMode("expand");
        this.interactionElement.switchMode("expand");
        vD.i(this.data.video_id).openedComment(this);

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
    },

    on_collapse: function() {
        if (this.interactionBBox!=null) this.interactionBBox.switchMode("normal");
        if (this.interactionElement!=null) this.interactionElement.switchMode("normal");
        vD.i(this.data.video_id).openedComment(this, true);
        if (this.discussionWindow!=null) {
            this.discussionWindow.closeWindow();
            this.discussionWindow = null;
        }
    },

    on_closeWindow: function() {
        this.interactionBBox.switchMode("normal");
        this.interactionElement.switchMode("normal");
        vD.i(this.data.video_id).openedComment(this, true);
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
    },

    changeOpacity: function(val) {
        if (!this.triggered) {
            if (this.bBoxUI!=null) this.bBoxUI.css({"opacity": val});
            if (this.element!=null) this.element.css({"opacity": val});
        }
    }
})

var discussionBoxArea = Class.extend({
    init: function(parent, data){
        this.parent = parent;
        this.data = data;
        this.id = this.data.id+"_discussionArea"
        this.activeComment = null;
        this.interactionElementList = {};

        this.on_show();
    },

    on_show: function(){
        this.interactionElementData = {
            "id": this.id+"_discussionArea",
            "defaultMode": "normal",
            "class": ["discussionAreaBox"],
            "default_return_val": true,
            "css": {
                "width": 15,
                "height": 15,
                "padding-left": 5,
                "padding-top": 5,
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
            this.interactionElement = new interactionElement(this.parent, this.interactionElementData);
            vD.i(this.interactionElement);
        }

        this.element = this.interactionElement.element
        this.element.empty();

        for (var i in this.data.comment_list) {
            this.populateElement(this.element, this.data.comment_list[i]);
        }


    },

    populateElement: function(parent, id, margin_left) {

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

        this.commentListElements[id+"_commentEl"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_commentEl",
            ["commentEl"]
        )
        var commentEl = this.commentListElements[id+"_commentEl"]

        this.commentListElements[id+"_commentUser"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_commentUser",
            ["commentUser"]
        )
        var commentUser = this.commentListElements[id+"_commentUser"]

        this.commentListElements[id+"_commentAdditionalData"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_commentAdditionalData",
            ["commentAdditionalData"]
        )
        var commentAdditionalData = this.commentListElements[id+"_commentAdditionalData"]

        var cData = vD.c(id);

        // draw annotations
        //vD.i(this.data.video_id).drawAnnotations(cData.annotation_arr);

        var comment = cData.comment;
        if ($.trim(comment)=="") comment = "&nbsp;";

        commentEl.append(cData.commenter+" says:<br/>"+comment+"<hr/>");
        commentUser.append("Date made: "+cData.timeStamp.toString());
        commentAdditionalData.append("Number of replies: "+cData.comment_list.length);

        this.commentListElements[id+"_oldCommentButtonArea"] = saveElement(
            this.commentListElements[id],
            "div",
            id+"_oldCommentButtonArea",
            ["oldCommentButtonArea"]
        )
        var oldCommentButtonArea = this.commentListElements[id+"_oldCommentButtonArea"]

        this.commentListElements[id+"_commentReply"] = new buttonClass(
            oldCommentButtonArea,
            "Reply",
            id+"_commentReply",
            $.proxy(this.addReply, this, id)
        )

        if (cData.comment_list.length>0) {
            this.commentListElements[id+"_seeDiscussion"] = new buttonClass(
                oldCommentButtonArea,
                "See Discussion",
                id+"_seeDiscussion",
                $.proxy(this.seeDiscussion, this, id, this.data.id)
            )
        }

        if (cData.replyTo==null) {
            this.commentListElements[id+"_newDiscussion"] = new buttonClass(
                oldCommentButtonArea,
                "New Discussion",
                id+"_newDiscussion",
                $.proxy(this.newDiscussion, this)
            )
        }

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



            //this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);
        } catch (e) {
            this.generalError(e);
        }
    },

    setupInteractionListElement: function(obj) {
        try {
            if (this.interactionElementData==null) throw new Error ("Setting up of the interactionElementData is not done");



            return obj;
            //this.interactionElementData.right_click.normal = $.proxy(this.right_click, this);
        } catch (e) {
            this.generalError(e);
        }
    }

    //on_mouseenter



})

