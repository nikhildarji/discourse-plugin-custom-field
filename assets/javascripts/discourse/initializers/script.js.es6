import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
    name: 'script',
    replace_url(elem, attr) {
        var elems = document.getElementsByTagName(elem);
        for (var i = 0; i < elems.length; i++)
            elems[i][attr] = elems[i][attr].replace('localhost:9292', 'andy.code.betacloud.tech:81').replace('localhost:3000', 'andy.code.betacloud.tech:81');
    },
    fix_dcfg_tags(){
        console.log("Fixing tags to be cooked");
        var dcfgField = document.getElementById('dcfgCustomFields');
        if(dcfgField){
            var cooked = document.getElementsByClassName("cooked");
            cooked[0].prepend(dcfgField)
            dcfgField.style.display  = "block"
        }

    },
    fix_localhost(){
        
        console.log("Localhost changed");
        this.replace_url('a', 'href');
        this.replace_url('img', 'src');   
    },
    
    initialize() {
        window.onload  =function(){
            //fix localhost in urls, issues
            this.fix_localhost();
            //this.fix_dcfg_tags();

            setTimeout(function() {
                this.fix_localhost()
            }.bind(this),3000);
        }.bind(this);


        withPluginApi('0.1', (api) => {
            api.onPageChange(() => {
               console.log("Page changed")
               //setTimeout(this.fix_dcfg_tags,1000);
            });
        });
        
    }
  };