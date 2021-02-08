function Structure () {

    this.canvas = document.getElementById('structure');
    this.context = this.canvas.getContext('2d');
    this.multiplier = 100.0;

    this.layout = [
        { x: 0, y: 0, width: 1, height: 2 },
        { x: 0, y: 2, width: 1, height: 1 },
        { x: 1, y: 0, width: 3, height: 2 },
        { x: 1, y: 2, width: 2, height: 1 },
        { x: 3, y: 2, width: 1, height: 1 },
        { x: 4, y: 0, width: 2, height: 1 },
        { x: 4, y: 1, width: 2, height: 2 },
        { x: 6, y: 0, width: 1, height: 1 },
        { x: 6, y: 1, width: 3, height: 2 },
        { x: 7, y: 0, width: 2, height: 1 },
        { x: 9, y: 0, width: 1, height: 2 },
        { x: 9, y: 2, width: 2, height: 1 },
        { x: 10, y: 0, width: 2, height: 2 },
        { x: 11, y: 2, width: 1, height: 1 },
        { x: 12, y: 0, width: 1, height: 1 },
        { x: 12, y: 1, width: 3, height: 2 },
        { x: 13, y: 0, width: 2, height: 1 }
    ];

    this.hitbox = [
        [[0,0], [0,1]],
        [[0,2]],
        [[1,0], [2,0], [3,0], [1,1], [2,1], [3,1]],
        [[1,2], [2,2]],
        [[3,2]],
        [[4,0], [5,0]],
        [[4,1], [5,1], [4,2], [5,2]],
        [[6,0]],
        [[6, 1], [7,1], [8,1], [6,2], [7,2], [8,2]],
        [[7,0], [8,0]],
        [[9,0], [9,1]],
        [[9,2], [10,2]],
        [[10,0], [11,0], [10,1], [11,1]],
        [[11,2]],
        [[12,0]],
        [[12,1], [13,1], [14,1], [12,2], [13,2], [14,2]],
        [[13,0], [14,0]]
    ];
}

Structure.prototype.drawTile = function(tileId){

    var x = this.layout[tileId].x*this.multiplier,
        y = this.layout[tileId].y*this.multiplier,
        width = this.layout[tileId].width*this.multiplier,
        height = this.layout[tileId].height*this.multiplier;

    this.context.drawImage(
        tiles[tileId].image,
        x,
        y,
        width,
        height);

    if(tiles[tileId].displayBanner !== "false" ){
        this.drawBanner(tileId, x, y, width, height);
    }

};

Structure.prototype.drawBanner = function(tileId, x, y, width, height){

    this.context.fillStyle = category_to_color(tiles[tileId].category);
    //this.context.fillStyle = "#63A135";

    if(this.layout[tileId].width > 1){
        // banner crop for large images
        var crop_x = 585 - Math.floor(tiles[tileId].textLong.length*5.6); 
    } else {
        // banner crop for small images
        var crop_x = 445; 
    }

    this.context.drawImage(
        tail,
        crop_x,                                         // banner flag source x-origin
        0,                                              // banner flag source y-origin
        631-crop_x,                                     // banner flag source width
        42,                                             // banner flag source height
        x + (0.06 * this.multiplier),                   // banner flag destination x-origin
        y + height - (0.25 * this.multiplier),          // banner flag destination y-origin
        0.0045 * (650-crop_x) * this.multiplier ,       // banner flag destination width
        0.2 * this.multiplier                           // banner flag destination height
    );

    this.context.fillRect(
        x + (0.06 * this.multiplier),              // banner colour x-origin
        y + height - (0.25 * this.multiplier),     // banner colour y-origin
        0.025 * this.multiplier,                   // banner colour width
        0.19 * this.multiplier                     // banner colour height
    );

    this.context.fillStyle = '#333333';             // banner TEXT colour
    this.context.font = 'normal 300 ' + Math.floor(this.canvas.height*0.025) + 'px Oswald';


    if(this.layout[tileId].width > 1){
        this.context.fillText(
            tiles[tileId].textLong,                    // Banner Text CONTENTS
            x + (0.13 * this.multiplier),              // Banner Text x-origin
            y + height - (0.121 * this.multiplier)     // Banner Text y-origin
        );
    } else {
        this.context.fillText(
            tiles[tileId].textShort,                   // Banner Text CONTENTS
            x + (0.13 * this.multiplier),              // Banner Text x-origin
            y + height - (0.121 * this.multiplier)     // Banner Text y-origin
        );
    }
};

Structure.prototype.clearTile = function(tileId){
    var x = this.layout[tileId].x*this.multiplier,
        y = this.layout[tileId].y*this.multiplier,
        width = this.layout[tileId].width*this.multiplier,
        height = this.layout[tileId].height*this.multiplier;

    this.context.clearRect(
        x,
        y,
        width,
        height);
};

Structure.prototype.fadeOutTile = function(tileId){
    this.clearTile(tileId);
    tiles[tileId].update(tileId);
};

Structure.prototype.fadeInTile = function(tileId){
    var x = this.layout[tileId].x*this.multiplier,
        y = this.layout[tileId].y*this.multiplier,
        width = this.layout[tileId].width*this.multiplier,
        height = this.layout[tileId].height*this.multiplier;

    this.context.drawImage(
        tiles[tileId].image,
        x,
        y,
        width,
        height);

    if(tiles[tileId].displayBanner !== "false" ){
        this.drawBanner(tileId, x, y, width, height);
    }
};

Structure.prototype.setMultiplier = function(){
    this.multiplier = Math.ceil(this.canvas.height/3);
};

Structure.prototype.fitCanvasToViewport = function(){
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if(w <= 800 && h >= w ) { //FOR TABLETS PORTRAIT
        this.canvas.width = (h - 220)*5;
        this.canvas.height = h - 220;
    } else { // Not A tablet in portait mode, do everything normal.
        this.canvas.width = h * 5;
        this.canvas.height = h;
    }
};

Structure.prototype.redraw = function () {
    for(var tile = 0; tile < tiles.length; tile++) {
        this.drawTile(tile);
    }
};
