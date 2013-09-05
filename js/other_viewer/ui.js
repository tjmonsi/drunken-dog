/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 30/8/13
 * Time: 9:35 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var viewerUI = Class.extend({
    init: function(parent, id) {
        this.parent = parent;
        this.id = id;
        this.activated = null;

        this.run();
    },

    run: function() {
        try {

            //console.log(vD);
            //console.log(vD);

            var total = vD.data.data.scene_objects.length


            for (var i in vD.data.data.scene_objects) {
                var obj = vD.data.data.scene_objects[i];

                new navBarObj($('#Navbar'), {"id": obj.id+"_navbar", "total": total});

                if (obj.type=="scene") {
                    new sceneObj($('#Content'), obj);
                } else if (obj.type=="quiz") {
                    new quizObj($('#Content'), obj);
                }


            }
            this.activated = vD.data.start_scene
            vD.i(this.activated+"_navbar").activate(true)

            for (var j in vD.discussion_set) {
                new commentThread($('#CommentArea'), vD.discussion_set[j]);
            }

        } catch (e) {
            this.generalError(e)
        }
    }

});

var navBarObj = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
        this.activated = false
        vD.i(this);
        this.run();
    },

    run: function() {

        var width = this.parent.width()-20;
        var subwidth = (width/this.data.total)-20;

        this.interactionElementData = {
            "id": this.id+"_area",
            "defaultMode": "normal",
            "class": ["navBarObj"],
            "default_return_val": true,
            "css": {
                "position": "static",
                "float": "left",
                "background-color": "#666666",
                "width": subwidth
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
        this.interactionElement = new interactionElement(this.parent, this.interactionElementData);
        vD.i(this.interactionElement);
        this.element = this.interactionElement.element;


    } ,

    setupInteractionElement: function(){
        this.interactionElementData.on_mouseenter.normal = $.proxy(this.on_mouseenter, this);
        this.interactionElementData.on_mouseleave.normal = $.proxy(this.on_mouseleave, this);
        this.interactionElementData.on_click.normal = $.proxy(this.on_click, this);
    },

    on_mouseenter: function() {
        log("navBarObj:on_mouseenter:"+this.id.split("_")[0])
        this.element.css({"background-color": "orange"});
    },

    on_mouseleave: function() {

        if (this.activated) {
            this.element.css({"background-color": "green"})
        } else {
            this.element.css({"background-color": "#666666"})
        }

    },

    on_click: function() {
        log("navBarObj:on_click:"+this.id.split("_")[0])
        //console.log(this.id)
        vD.i(vUI.activated+"_navbar").activate(false);
        this.activate(true);
        vUI.activated = this.id.split("_")[0]

    },

    activate: function(flag) {

        this.activated = flag;
        if (this.activated) {
            log("navBarObj:showSet:"+this.id.split("_")[0])
            this.element.css({"background-color": "green"});
            vD.i(this.id.split("_")[0]+"_content").on_show();
        } else {
            log("navBarObj:hideSet:"+this.id.split("_")[0])
            this.element.css({"background-color": "#666666"})
            vD.i(this.id.split("_")[0]+"_content").on_hide();
        }

    }
})

var sceneObj = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id+"_content";

        vD.i(this);
        this.run();
    },

    run: function() {
        this.elementType = null;
        this.attr = {};
        this.css = {};
        this.css.left = this.data.x;
        this.css.top = this.data.y;

        //console.log(this.css);

        this.val = null;
        this.classes = [];

        this.gen_css = {};
        this.gen_css.left = this.data.x-50;
        this.gen_css.top = this.data.y-50;

        if (this.data.object_data.font_size!=null) this.css["font-size"] = this.data.object_data.font_size;
        if (this.data.object_data.width!=null) this.css.width = this.data.object_data.width;
        if (this.data.object_data.height!=null) this.css.height = this.data.object_data.height;
        if (this.data.object_data.color!=null) this.css.color = this.data.object_data.color;
        if (this.data.object_data.background_color!=null) this.css['background-color'] = this.data.object_data.background_color;


        this.elementType = "div";
        this.classes.push('sub_video');


    },

    on_show: function() {
        //console.log(this.parent)
        if (this.element == null) {
            this.element = saveElement(this.parent, this.elementType, this.id, this.classes, this.attr);
            this.element.css(this.css);
            this.video = new videoPlayer(this.element, this.data, this.parent.width()-10, false);
            vD.i(this.video);
            $('#Sidebar').empty();
            if (this.data.next!=null) {
                this.nextButton = new buttonClass($('#Sidebar'), "Skip Next Part", this.id+"_next", $.proxy(this.on_next, this));
                this.nextElement = this.nextButton.element;
                $('#Sidebar').append(br());
            }
            if (this.data.prev!=null) {
                this.prevButton = new buttonClass($('#Sidebar'), "Go Back", this.id+"_prev", $.proxy(this.on_prev, this));
                this.prevElement = this.prevButton.element;
            }

            var height = this.element.height()+30;
            $('#ContentArea').css({"height": height})

            $('#CommentArea').removeClass('hide')
        }
    },

    on_hide: function() {
        if (this.element == null) return;
        this.video.close();
        this.video= null;

        if (this.nextButton!=null) {
            this.nextButton.close();
            this.nextElement = null;
            this.nextButton=null;
        }

        if (this.prevButton!=null) {
            this.prevButton.close();
            this.prevElement = null;
            this.prevButton = null;
        }

        this.element.remove();
        this.element = null;
    },

    on_next: function() {
        log("sceneObj:on_next:"+this.id.split("_")[0])
        if (this.data.next!=null) {
            vD.i(vUI.activated+"_navbar").activate(false);
            vD.i(this.data.next+"_navbar").activate(true);
            vUI.activated = this.data.next
        }
    },

    on_prev: function() {
        log("sceneObj:on_prev:"+this.id.split("_")[0])
        if (this.data.prev!=null) {
            vD.i(vUI.activated+"_navbar").activate(false);
            vD.i(this.data.prev+"_navbar").activate(true);
            vUI.activated = this.data.prev
        }
    }


})

var quizObj = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = this.data.id+"_content";

        vD.i(this);
        //console.log(this.id)
        this.run();
    },

    run: function() {
        this.elementType = null;
        this.attr = {};
        this.css = {};
        this.css.left = this.data.x;
        this.css.top = this.data.y;

        //console.log(this.css);

        this.val = null;
        this.classes = [];

        this.gen_css = {};
        this.gen_css.left = this.data.x-50;
        this.gen_css.top = this.data.y-50;

        if (this.data.object_data.font_size!=null) this.css["font-size"] = this.data.object_data.font_size;
        if (this.data.object_data.width!=null) this.css.width = this.data.object_data.width;
        if (this.data.object_data.height!=null) this.css.height = this.data.object_data.height;
        if (this.data.object_data.color!=null) this.css.color = this.data.object_data.color;
        if (this.data.object_data.background_color!=null) this.css['background-color'] = this.data.object_data.background_color;


        this.elementType = "div";
        this.classes.push('sub_video');


    },

    on_show: function() {
        //console.log(this.parent)
        this.submit_status = 1;
        //console.log("quizObj")
        if (this.element == null) {
            $('#Sidebar').empty();
            this.element = saveElement(this.parent, this.elementType, this.id, this.classes, this.attr);
            this.element.css(this.css);

            this.question = saveElement(this.element, "div", this.id+"_question", ['question']);
            this.question.append(this.data.object_data.q);
            if (this.data.object_data.type=="mcq") {

                this.mcq = saveElement(this.element, "div", this.id+"_mcq", ['mcq']);
                this.mcq_elements = {};

                for (var i in this.data.object_data.mc) {
                    var attr = {};
                    attr.type = 'radio';
                    attr.name  = this.id;
                    attr.value = this.data.object_data.mc[i].val

                    this.mcq_elements[this.id+"_mcqval_"+this.data.object_data.mc[i].val] = saveElement(this.mcq,
                        "input",
                        this.id+"_mcqval_"+this.data.object_data.mc[i].val,
                        ["mcq_el"],
                        attr
                    )

                    this.mcq_elements[this.id+"_mcqvalText_"+this.data.object_data.mc[i].val] = saveElement(this.mcq,
                        "span",
                        this.id+"_mcqvalText_"+this.data.object_data.mc[i].val,
                        ['mcq_text']
                    )
                    this.mcq_elements[this.id+"_mcqvalText_"+this.data.object_data.mc[i].val].append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.data.object_data.mc[i].text)
                    this.mcq.append(br());
                }

                this.wrongPNG = saveElement(this.parent, "img", this.id+"_wrongPNG", ['wrongPNG', 'hide']);
                this.rightPNG = saveElement(this.parent, "img", this.id+"_rightPNG", ['rightPNG', 'hide']);
                this.wrongPNG.attr("src", "./images/wrong.png");
                this.rightPNG.attr("src", "./images/right.png");

            } else if (this.data.object_data.type == "input") {
                this.input_div = saveElement(this.element, "div", this.id+"_input_div", ["input_div"]);
                this.input_elements = {};

                for (var i in this.data.object_data.input) {
                    var obj = this.data.object_data.input[i]
                    this.input_elements[obj.id+"_label"] = saveElement(this.input_div, "span", obj.id+"_label", ["input_label"]);
                    this.input_elements[obj.id+"_label"].append(obj.label);

                    this.input_elements[obj.id+"_input"] = saveElement(this.input_div, "input", obj.id+"_input", ["input_input"], {"type": "input", "name": obj.id});

                    this.input_elements[obj.id+"_right"] = saveElement(this.input_div, "img", obj.id+"_rightPNG", ['rightPNG', 'hide']);
                    this.input_elements[obj.id+"_right"].attr("src", "./images/right.png");

                    this.input_elements[obj.id+"_wrong"] = saveElement(this.input_div, "img", obj.id+"_wrongPNG", ['wrongPNG', 'hide']);
                    this.input_elements[obj.id+"_wrong"].attr("src", "./images/wrong.png");

                    this.input_div.append(br());

                }


            }

            this.submitButton = new buttonClass(this.element, "Submit Answer", this.id+"_submit", $.proxy(this.on_submit, this));
            this.submitElement = this.submitButton.element;

            if (this.data.next!=null) {
                this.nextButton = new buttonClass($('#Sidebar'), "Skip Next Part", this.id+"_next", $.proxy(this.on_next, this));
                this.nextElement = this.nextButton.element;
                $('#Sidebar').append(br());
            }
            if (this.data.prev!=null) {
                this.prevButton = new buttonClass($('#Sidebar'), "Go Back", this.id+"_prev", $.proxy(this.on_prev, this));
                this.prevElement = this.prevButton.element;
            }
            //this.video = new videoPlayer(this.element, this.data, this.parent.width()-10, false);
            //vD.i(this.video);
            var height = this.element.height();
            $('#ContentArea').css({"height": height})


            $('#CommentArea').addClass('hide')
        }
    },

    on_hide: function() {
        if (this.element == null) return;

        this.question.remove();
        this.question = false;

        if (this.data.object_data.type=="mcq") {

            for (var i in this.mcq_elements) {
                this.mcq_elements[i].remove();
                this.mcq_elements[i] = null
            }

            this.mcq_elements = null;

            this.wrongPNG.remove();
            this.wrongPNG = null
            this.rightPNG.remove();
            this.rightPNG = null
        } else if (this.data.object_data.type=="input"){
            for (var j in this.input_elements) {
                this.input_elements[j].remove();
                this.input_elements[j] = null;
            }
            this.input_elements[j];
        }

        this.submitButton.close();
        this.submitElement = null;
        this.submitButton = null

        if (this.nextButton!=null) {
            this.nextButton.close();
            this.nextElement = null;
            this.nextButton=null;
        }

        if (this.prevButton!=null) {
            this.prevButton.close();
            this.prevElement = null;
            this.prevButton = null;
        }

        this.element.remove();
        this.element = null;
    },

    on_submit: function() {

        var correct_status = true;

        if (this.submit_status == 1) {
            if (this.data.object_data.type=="mcq") {
                var val = $("input[type='radio'][name='"+this.id+"']:checked");
                var input_value = null;
                if (val.length>0) {
                     input_value = val.val();
                }
                //console.log(this.data.object_data.ans);
                //console.log(input_value);
                if (input_value!=this.data.object_data.ans) {
                    correct_status=false;
                    this.wrongPNG.removeClass('hide');
                } else {
                    this.rightPNG.removeClass('hide');
                }
                ///console.log(input_value);
                //console.log(val);
                //console.log(this.id);

            } else if (this.data.object_data.type=="input") {

                for (var i in this.data.object_data.input) {
                    var obj = this.data.object_data.input[i];

                    var input_value = this.input_elements[obj.id+"_input"].val();
                    var correct = obj.ans;

                    if (input_value.toLowerCase()!=obj.ans.toLowerCase()) {
                        correct_status=false;
                        this.input_elements[obj.id+"_wrong"].removeClass('hide')
                    } else {
                        this.input_elements[obj.id+"_right"].removeClass('hide')
                    }

                }

            }

            if (correct_status) {
                log("quizObj:allCorrect:"+this.id.split("_")[0])
                this.submitElement.empty();
                this.submitElement.append("Continue");
                this.submit_status = 2
            } else {
                log("quizObj:someWrong:"+this.id.split("_")[0])
                this.submitElement.empty();
                this.submitElement.append("Retry");
                this.submit_status = 3
            }

        } else if (this.submit_status == 2) {
            log("quizObj:Continue:"+this.id.split("_")[0])
            if (this.data.next!=null) {
                vD.i(vUI.activated+"_navbar").activate(false);
                vD.i(this.data.next+"_navbar").activate(true);
                vUI.activated = this.data.next
            }

        } else if (this.submit_status == 3) {
            log("quizObj:Retry:"+this.id.split("_")[0])
            if (this.data.object_data.type=="mcq") {

                this.wrongPNG.addClass('hide');
            } else if (this.data.object_data.type=="input"){
                for (var i in this.data.object_data.input) {
                    var obj = this.data.object_data.input[i];
                    this.input_elements[obj.id+"_wrong"].addClass('hide')
                }
            }

            this.submitElement.empty();
            this.submitElement.append("Submit Answer");
            this.submit_status = 1

        }


    },

    on_next: function() {
        log("quizObj:on_next:"+this.id.split("_")[0])
        if (this.data.next!=null) {
            vD.i(vUI.activated+"_navbar").activate(false);
            vD.i(this.data.next+"_navbar").activate(true);
            vUI.activated = this.data.next
        }
    },

    on_prev: function() {
        log("quizObj:on_prev:"+this.id.split("_")[0])
        if (this.data.prev!=null) {
            vD.i(vUI.activated+"_navbar").activate(false);
            vD.i(this.data.prev+"_navbar").activate(true);
            vUI.activated = this.data.prev
        }
    }
})

var commentThread = Class.extend({
    init: function(parent, data){
        this.parent = parent;
        this.data = data;
        this.id = this.data.id+"_discussionArea"
        this.activeComment = null;
        this.interactionElementList = {};
        this.commentListElements = {};
        vD.i(this);
        //console.log(this.id);
        this.on_show();
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
            this.interactionElement = new interactionElement(this.parent, this.interactionElementData);
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

        //console.log(this.interactionElementList)
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

        //commentEl.append(cData.commenter+" says:<br/><br/><br/>"+comment+"<br/><br/><hr/>");
        commentEl.append("<b>"+cData.commenter+"</b> says:<br/><br/><br/>"+comment+"<br/><br/>");

        if (cData.video_list!=null) {
            if (cData.video_list.length!=0) {
                commentEl.append("Video List:<br/>");
                for (var video_i in cData.video_list) {
                    var vid = cData.video_list[video_i].object_data.object_data.id;
                    var vidbeg =  cData.video_list[video_i].object_data.begin;
                    commentEl.append('<a target="_blank" href="http://www.youtube.com/watch?v='+vid+'&t='+vidbeg+'">http://www.youtube.com/watch?v='+vid+'&t='+vidbeg+'</a><br/>');
                }
                commentEl.append("<br/><br/><hr/>");
            }

        }



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
        log("commentThread:on_mouseenter:"+this.id.split("_")[0])
        //console.log("this is enter");
        //console.log(this.id.split("_")[0]+"_discussionTrigger")
        //console.log(vD.i(this.id.split("_")[0]+"_discussionTrigger"))
        //console.log(this.id);
        //vD.i(this.id.split("_")[0]+"_discussionTrigger").on_showbBox();
        this.element.css({"background-color": "#999999", "color": "#000000"})
        //vD.i()
    },

    on_mouseleave: function(event) {
        //console.log("this is leave");
        log("commentThread:on_mouseleave:"+this.id.split("_")[0])
        if (this.newCommentInput!=null) {
            if (this.newCommentInput.annotation_flag) {
                return;
            }
        }

        this.element.css({"background-color": "##777777", "color": "#ffffff"})
        //vD.i(this.id.split("_")[0]+"_discussionTrigger").on_hidebBox();
    },

    on_click: function(event) {
        //console.log(obj)
    },

    on_mouseenterComment: function(event) {
        //console.log("comment enter")
       // console.log(event.target.id);
        //log("discussionBoxArea:on_mouseenterComment:"+this.id.split("_")[0])
        var comment_id = event.target.id.split("_")[0]
        log("commentThread:on_mouseenterComment:"+this.id.split("_")[0]+":"+comment_id)
        //this.drawAnnotation(comment_id)
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
        //if (cData.replyTo) this.drawAnnotation(cData.replyTo);
        //vD.i(this.data.video_id).drawAnnotations(cData.annotation_arr, true);
    },

    on_mouseleaveComment: function(event) {
        //console.log("comment left")
        //console.log(event.target.id);

        if (this.newCommentInput!=null) {
            if (this.newCommentInput.annotation_flag) {
                return;
            }
        }
        var cData = vD.c(event.target.id.split("_")[0]);
        var color = "transparent";

        if (cData.commenter == vD.user) color = "#009900";

        this.commentListElements[event.target.id.split("_")[0]].css({"background-color": color});
        //vD.i(this.data.video_id).clearAnnotations();
    },

    on_clickComment: function( event) {
        log("commentThread:on_clickComment:"+this.id.split("_")[0])
        //console.log("comment clicked")
        //console.log(event.target.id.split("_")[0]);
        //console.log(vD.i(this.data.video_id).discussionArea.scrollTop());
        //ar current_top = vD.i(this.data.video_id).discussionArea.scrollTop()
        //var comment_y = this.commentListElements[event.target.id.split("_")[0]].offset().top;
        //var disc_y = vD.i(this.data.video_id).discussionArea.offset().top;

        //var cData = vD.c(event.target.id.split("_")[0]);
        //var dData = vD.d(cData.discussion_id);
        //vD.i(dData.video_id).seek(dData.time, true);

        //console.log(comment_y);
        //console.log(disc_y);
        //console.log(comment_y-disc_y)
        //console.log(this.commentListElements[event.target.id.split("_")[0]].position().top-210);
        //var posy = this.commentListElements[event.target.id.split("_")[0]].position().top-210
        //if (posy>10) vD.i(this.data.video_id).discussionArea.animate({"scrollTop" : this.commentListElements[event.target.id.split("_")[0]].position().top-200})
        //vD.i(this.data.video_id).discussionArea.animate({"scrollTop": comment_y-disc_y-210+current_top});
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
        log("commentThread:addReply:"+this.id.split("_")[0]+":"+last_commentID)
        //console.log(data);
        //console.log(this.data.id)
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
        log("commentThread:saveComment:"+data.discussion_id+":"+data.id+":"+data.replyTo)
        vD.c(data);
        //console.log(data)
        //console.log(data.discussion_id)
        if (data.replyTo==null) {
            var obj = vD.d(data.discussion_id.replace("_discussionTrigger",""))
            obj.comment_list.push(data.id);
            vD.d(obj);
            this.updateDiscussion(obj);
            // update elements
            //vD.i(data.discussion_id+"_discussionTrigger").updateData(obj);
        } else {
            var obj = vD.c(data.replyTo)
            obj.comment_list.push(data.id);
            //console.log(obj);
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
        //vD.i(this.data.video_id).backToMode();
    },

    allCommentsBackToTransparent: function() {

    },

    seeDiscussion: function(comment_id) {
        log("commentThread:seeDiscussion:"+this.id.split("_")[0]+":"+comment_id)
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
})

