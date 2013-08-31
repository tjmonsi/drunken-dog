/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 30/8/13
 * Time: 2:00 PM
 * To change this template use File | Settings | File Templates.
 */

var commentBox = Class.extend({
    init: function(parent, data){
        this.parent = parent;
        this.data = data;

        do {
            var new_id = makeID(global_id_length*2);
            //console.log(vD.comments(new_id))
        } while (vD.comments(new_id)!=null);

        this.id = new_id;
        this.annotation_arr = [];
        this.annotation_flag = false;
        this.commentBox_flag = false;
        this.commenterInput_flag = false;

        this.defaultvalue = {};
        this.defaultvalue.comment = "please put your comment here"
        this.defaultvalue.commenter = vD.user;

        vD.i(this);
        this.run();
    },

    run: function() {
        this.commentBoxArea = saveElement(this.parent, "div", this.id+"_commentBoxArea", ["commentBoxArea"]);
        this.commentBox = saveElement(this.commentBoxArea, "textarea", this.id+"_comment", ["commentBox"]);
        this.commentBox.val(this.defaultvalue.comment);
        this.commentBox.focus($.proxy(this.clearCommentBox, this));
        this.commentBox.blur($.proxy(this.resetCommentBox, this));
        this.commentBoxArea.append(br());

        this.commenter = saveElement(this.commentBoxArea, "input", this.id+"_commenter", ["commenterInput"]);
        this.commenter.val(this.defaultvalue.commenter);
        this.commenter.focus($.proxy(this.clearCommenterInput, this));
        this.commenter.blur($.proxy(this.resetCommenterInput, this));

        this.commentButtonArea = saveElement(this.parent, "div", this.id+"_commentButtonArea", ["commentButtonArea"]);

        this.clearComment = new buttonClass(this.commentButtonArea, "Erase", this.id+"_clearComment", $.proxy(this.clearNewComment, this));
        this.submitComment = new buttonClass(this.commentButtonArea, "Submit", this.id+"_submitComment", $.proxy(this.submitNewComment, this));
        this.cancelComment = new buttonClass(this.commentButtonArea, "Cancel", this.id+"_cancelComment", $.proxy(this.cancelNewComment, this));
        //this.drawButton = new buttonClass(this.commentButtonArea, "Draw in Video", this.id+"_drawAnnotation", $.proxy(this.drawAnnotation, this));
    },

    clearCommentBox: function() {
        if (!this.commentBox_flag) {
            this.commentBox.val("")
            this.commentBox_flag = true
        }
    },

    clearCommenterInput: function() {
        if (!this.commenterInput_flag){
            this.commenter.val("")
            this.commenterInput_flag = true
        }
    },

    resetCommentBox: function(event, flag) {
        if (flag) {
            this.commentBox.val("")
        }

        if ($.trim(this.commentBox.val())=="") {
            this.commentBox_flag = false;
            this.commentBox.val(this.defaultvalue.comment);
        }
    },

    resetCommenterInput: function(event, flag){
        if (flag) {
            this.commenter.val("")
        }
        if ($.trim(this.commenter.val())=="") {
            this.commenterInput_flag = false;
            this.commenter.val(this.defaultvalue.commenter);
        }
    },

    clearNewComment: function() {
        this.resetCommentBox(null, true);
        this.resetCommenterInput(null, true);


        for (var i in this.annotation_arr) {
            vD.a(this.annotation_arr[i], true);
        }
        this.annotation_arr = [];
    },

    submitNewComment: function() {
        var data = {
            "id": this.id,
            "discussion_id": this.data.discussion_id,
            "comment": replaceURLs(this.commentBox.val()),
            "commenter": this.commenter.val(),
            "timeStamp": new Date(),
            "annotation_arr": this.annotation_arr,
            "replyTo": this.data.replyTo,
            "comment_list": []
        }
        this.data.saveComment(data);
    },

    cancelNewComment: function(){
        log("commentBox:cancelNewComment:"+this.data.discussion_id+":"+this.id.split("_")[0]+":"+this.data.replyTo)
        this.clearNewComment();
        //vD.i(this.data.video_id).clearAnnotations();
        if (vD.i(this.data.video_id).interactionElement.mode == "draw") {
            vD.i(this.data.video_id).interactionElement.mode = vD.i(this.data.video_id).last_mode;
        }

        this.data.closeWindow();
    },


    saveAnnotation: function(obj) {
        this.annotation_arr.push(obj);
    }

})