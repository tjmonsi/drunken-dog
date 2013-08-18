/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 18/8/13
 * Time: 10:39 AM
 * To change this template use File | Settings | File Templates.
 */

var embeddedObject = Class.extend({
    init: function(parent, data) {
        this.parent = parent;
        this.data = data;
        this.id = data.id;
    },

    run: function() {
        console.log("I will not create anything. This is the base class for embeddedObjects")
    }
})