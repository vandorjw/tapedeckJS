function ContentPool () {
    this.content = Array(17);
}

ContentPool.prototype.length = function (){
    return this.content.length;
}

ContentPool.prototype.update = function () {
    var self = this;
    var contentlist = document.getElementsByClassName("image");

    // turn the DomElements into a useable format
    for (var i = 0; i < contentlist.length; i += 1) {

        image = new Image();
  
        image.onload = (function (nr) {
            return function() {
                self.notify(nr);
            }
        }(i));
        image.src = contentlist[i].dataset.image;
        
        this.content[i] = {
            image: image,
            category: contentlist[i].dataset.category,
            url: contentlist[i].dataset.url,
            textLong: contentlist[i].dataset.textLong,
            textShort: contentlist[i].dataset.textShort,
            displayBanner: contentlist[i].dataset.displayBanner,
            newWindow: contentlist[i].dataset.newWindow
        };
    }
};

ContentPool.prototype.notify = function(tile){
    structure.fadeOutTile(tile);
};
