export default {
    name: 'script',
    replace_url(elem, attr) {
        var elems = document.getElementsByTagName(elem);
        for (var i = 0; i < elems.length; i++)
            elems[i][attr] = elems[i][attr].replace('localhost:9292', 'andy.code.betacloud.tech:81').replace('localhost:3000', 'andy.code.betacloud.tech:81');
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
            setTimeout(function() {
                this.fix_localhost
            }.bind(this),3000);
        }.bind(this);

        window.addEventListener('locationchange', function(){
            this.fix_localhost();

        })
    }
  };