/**
 * Created with JetBrains WebStorm.
 * User: tjmonsi
 * Date: 20/8/13
 * Time: 1:52 PM
 * To change this template use File | Settings | File Templates.
 */

var actionObject = Class.extend({
    init: function(parent, data){
        this.parent = parent;
        this.data = data;
        this.id = this.data.id;
    },

    trigger: function() {
        if (this.data.play!=null) {
            vD.i(this.data.scene_id).time_gate=false;
            if (this.data.play=="current") {
                vD.i(this.data.scene_id).play();
            } else {
                vD.i(this.data.scene_id).seek(this.data.play);
            }
        }

        if (this.data.pause) {
            vD.i(this.data.scene_id).pause();
        }

        for (var key in this.data.show) {
            vD.i(this.data.show[key]).on_show();
            vD.i(this.data.show[key]).fromAction = true;
        }

        for (var key in this.data.show_all) {
            vD.i(this.data.show_all[key]).data.show=true;
            vD.i(this.data.show_all[key]).on_show();
            vD.i(this.data.show_all[key]).fromAction = true;
        }

        for (var key in this.data.hide) {
            vD.i(this.data.hide[key]).on_hide();
        }

        for (var key in this.data.hide_all) {
            vD.i(this.data.hide_all[key]).data.show=false;
            vD.i(this.data.hide_all[key]).on_hide();
        }

        for (var key in this.data.clear_val) {
            vD.i(this.data.clear_val[key]).element.val("")
        }

        for (var key in this.data.chave_val) {
            vD.i(this.data.change_val[key].element).element.val(this.data.change_val[key].val);
        }
    }
})