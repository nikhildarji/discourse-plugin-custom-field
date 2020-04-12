import { popupAjaxError } from 'discourse/lib/ajax-error';
import Topic from 'discourse/models/topic';
import { ajax } from 'discourse/lib/ajax';

//api.getCurrentUser();
export default {
  actions: {
    setPrice(topic){
      bootbox.prompt("Enter price in USD","Cancel","Save", function(result){
        if(result!=null){
          this.postPrice(topic,"dcfg_price",result);
        }
      }.bind(this),topic.dcfg_custom_fields.dcfg_price ? topic.dcfg_custom_fields.dcfg_price : "");
    },

    setURL(topic){
      bootbox.prompt("Enter URL (with https://)","Cancel","Save", function(result){
        if(result!=null){
          this.postPrice(topic,"dcfg_url",result);
        }

      }.bind(this),topic.dcfg_custom_fields.dcfg_url ? topic.dcfg_custom_fields.dcfg_url :"https://");
    },

    postPrice(topic,key,result){
      ajax("/topic/updatecustomfield", {
        type: "POST",
        data: {
          topic_id: topic.id,
          key:key,
          value:result
        }
      }).then((result) => {

        console.log(result);
        topic.set('custom_fields.dcfg_price', result.dcfg_price);
        topic.set('dcfg_custom_fields.dcfg_price', result.dcfg_price);

        topic.set('custom_fields.dcfg_url', result.dcfg_url);
        topic.set('dcfg_custom_fields.dcfg_url', result.dcfg_url);
  
  
      }).catch((e) => {
        console.error(e);
        bootbox.alert("Failed to save the data");
      });
    }
  }
};
