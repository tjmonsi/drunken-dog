"use strict";

function updateSize(){
    win_width = $(document).width();
    win_height = $(document).height();

    //UI.asset_bar.asset_bar_list_resize();
}

function makeID(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function save_element(parent, el, id, classes, attributes){
    var element = create_element(el, id, classes, attributes);
    parent.append(element);
    return $(el+"#"+id);
}

function br(){
    return create_element('br');
}

function create_element(el, id, classes, attributes) {
    var element = document.createElement(el);
    // add id
    if (id) element.id = id;
    // add classes
    if (classes) {
        for (var classname in classes) {
            element.classList.add(classes[classname]);
        }
    }
    // add other attributes
    if (attributes) {
        var key;
        for (key in attributes) {
            var value = attributes[key];
            if (key == 'textContent') {
                element.textContent = value;
            }
            else {
                element.setAttribute(key, value);
            }
        }
    }
    return element;
}

function creation_success(classtype, id){
    var name = classtype+": "+id;

    var t = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"

    for (var i=0; i<(name.length/4)+1; i++){
        t=t.substring(0,t.length-1)
    }

    var msg = name+t+console_messages.general.create_success
    console.log(msg)
}

function general_functions(){
    this.test = function() {
        return 0;
    }
}