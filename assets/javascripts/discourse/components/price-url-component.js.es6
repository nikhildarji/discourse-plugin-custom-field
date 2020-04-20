import { action } from '@ember/object';
import { popupAjaxError } from 'discourse/lib/ajax-error';
import Topic from 'discourse/models/topic';
import { ajax } from 'discourse/lib/ajax';
import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators"


export default Ember.Component.extend({
    didInsertElement() {
        this._super();
        this.fix_dcfg_tags();
    },

    fix_dcfg_tags(){
        console.log("Fixing tags to be cooked");
        var dcfgField = document.getElementById('dcfgCustomFields');
        if(dcfgField){
            var cooked;
            var cookerTimer = setInterval(function(){
                cooked = document.getElementsByClassName("cooked");

                if(cooked){
                    clearInterval(cookerTimer);
                    cooked[0].prepend(dcfgField)
                    dcfgField.style.display  = "block"
                }

            },100);
        }

    },

    willDestroyElement() {
        this._super();
        this.$().stop();
    },

    get showPriceUrlBox(){
        return this.model.dcfg_custom_fields.dcfg_price || this.model.details.can_edit;
    },


    get showUrlBox(){
        //return  model.dcfg_custom_fields.dcfg_url;
        var userGroups = this.currentUser.groups;
        for(var i=0; i< userGroups.length; i++){
            var gname = userGroups[i].name.toLowerCase();
            if(gname=="admins" || gname=="premium" ||  gname=="verified" ||  gname=="staff"){
                return true;
            }
        }
        return false;
    },


    @action
    setPrice(topic) {
        bootbox.prompt("Enter price in USD", "Cancel", "Save", function (result) {
            if (result != null) {
                this.postPrice(topic, "dcfg_price", result);
            }
        }.bind(this), topic.dcfg_custom_fields.dcfg_price ? topic.dcfg_custom_fields.dcfg_price : "");
    },

    @action
    setURL(topic) {
        bootbox.prompt("Enter URL (with https://)", "Cancel", "Save", function (result) {
            if (result != null) {
                this.postPrice(topic, "dcfg_url", result);
            }

        }.bind(this), topic.dcfg_custom_fields.dcfg_url ? topic.dcfg_custom_fields.dcfg_url : "https://");
    },

    
    postPrice(topic, key, result) {
        ajax("/topic/updatecustomfield", {
            type: "POST",
            data: {
                topic_id: topic.id,
                key: key,
                value: result
            }
        }).then((result) => {

            console.log(result);
            topic.set('dcfg_custom_fields.dcfg_price', result.dcfg_price);

            topic.set('dcfg_custom_fields.dcfg_url', result.dcfg_url);


        }).catch((e) => {
            console.error(e);
            bootbox.alert("Failed to save the data");
        });
    }


});