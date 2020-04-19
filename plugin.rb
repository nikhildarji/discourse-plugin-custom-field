# name: price-url-for-posts
# about: A plugin to add price and url support for posts
# version: 0.0.1
# authors: @hack4mer

after_initialize do

    PLUGIN_NAME ||= "discourse_custom_field_generator".freeze


    
    add_to_serializer(:topic_view, :dcfg_custom_fields, false) {
        object.topic.custom_fields
    }

    #Initialize DiscourseCustomFieldGenerator class
    module ::DiscourseCustomFieldGenerator
        class Engine < ::Rails::Engine
          engine_name PLUGIN_NAME
          isolate_namespace DiscourseCustomFieldGenerator
        end
    end
    
    require_dependency "application_controller"

    class DiscourseCustomFieldGenerator::FieldController < ::ApplicationController
        requires_plugin PLUGIN_NAME

        # before_action :ensure_logged_in

        #Disables csrf protection
        skip_before_action :verify_authenticity_token

        def set 
            topic_id   = params.require(:topic_id)
   

            #Save topic
            topic = Topic.find_by_id(topic_id)

            if (defined? params[:price])
                topic.custom_fields['dcfg_price'] =  params[:price]
            end
            if (defined? params[:url])
                topic.custom_fields['dcfg_url'] =  params[:url]
            end

            topic.save!

            render json: topic.custom_fields
        end

        def update    
            topic_id   = params.require(:topic_id)
            key        = params.require(:key)
            value      = params.require(:value)
            user       = current_user
            
            #Save topic
            topic = Topic.find_by_id(topic_id)
            topic.custom_fields[key] = value
            topic.save!

            render json: topic.custom_fields
        end

    end

    #Add custom routes
    DiscourseCustomFieldGenerator::Engine.routes.draw do
        post "/setpriceandurl" => "field#set"
        post "/updatecustomfield" => "field#update"
    end

    #Append routes to /topic
    Discourse::Application.routes.append do
        mount ::DiscourseCustomFieldGenerator::Engine, at: "/topic"
    end

end
