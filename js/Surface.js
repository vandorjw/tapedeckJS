function Surface() {

    this.canvas = document.getElementById('surface');
    this.context = this.canvas.getContext('2d');
    this.offset = 0;
    this.scrollspeed = 50;
    this.tapedeck = null;
    this.PointX_start = null;
    this.PointX_move = null;
    this.is_hovering = false;
    this.DEBUG = false;
}


Surface.prototype.attachListeners = function(){
    var self = this;

    window.addEventListener("keydown", function(e) { self.scrollKeyboard(e); }, false);

    this.canvas.addEventListener('click', function (e) { self.clickOpenUrl(e); }, false);
    this.canvas.addEventListener('mousemove', function (e) { self.makePointer(e); }, false);
    this.canvas.addEventListener('touchstart', function (e) { self.setLastPointX(e); }, false);
    this.canvas.addEventListener("touchmove", function (e) { self.touchmove(e); }, false);
    this.canvas.addEventListener('touchend', function (e) { self.openUrl(e); }, false);

    if (this.canvas.addEventListener) {
        this.canvas.addEventListener('mousewheel', function (e) { self.scroll(e); }, false);
        this.canvas.addEventListener('DOMMouseScroll', function (e) { self.scroll(e); }, false);
    } else {
        this.canvas.attachEvent('onmousewheel', function (e) { self.scroll(e); });
    }
};


Surface.prototype.fitCanvasToViewport = function () {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if(w <= 800 && h >= w ) { 
        this.canvas.width = w;
        this.canvas.height = h - 220;
    } else { 
        this.canvas.width = w;
        this.canvas.height = h;
    }
};


Surface.prototype.scroll = function (e) { // Scroll left or right.

    $('#logoTwo').hide(250);
    $('#menu_content,#search_content').hide(250);
    scrollTagEvent();

    var e = window.event || e;
    this.offset += this.scrollspeed * Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
};


Surface.prototype.scrollKeyboard = function (e) { // Scroll left or right.
    var e = window.event || e;
    
    var scroll = 0;
    if (e.keyCode === 37) {
        // left arrow
        scroll = -25;
    }
    else if (e.keyCode === 39) {
        // right arrow
        scroll = 25;
    }
    this.offset += scroll;
};


Surface.prototype.draw = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //reset, start from beginning
    if (this.offset > structure.canvas.width) {
        this.offset = this.offset - structure.canvas.width;

    }
    else if (this.offset < 0 && (Math.abs(this.offset) >= this.canvas.width)) {
        this.offset = structure.canvas.width - this.canvas.width;
    }

    var remainder = structure.canvas.width - this.offset,
        required = this.canvas.width;

    // CASE1: A SINGLE STRUCTURE IMAGE CAN COVER THE SURFACE ON HIS OWN.
    // This requires the offset to be possitive, and that the remainder of the
    // structure, after subtracting the offset, equal or greater than the surface width.
    if(this.offset >= 0 && ( remainder >= required )){
        this.context.drawImage(
            structure.canvas,
            this.offset, 0, surface.canvas.width, structure.canvas.height,
            0, 0, surface.canvas.width, surface.canvas.height);
    }
    // CASE2: THE POSITIVE OFFSET IS SUCH THAT A SINGLE DRAWN "STRUCTURE" CANNOT
    // COVER THE ENTIRE SURFACE, GIVEN THE POSSITVE OFFSET WE ARE DEALING WITH.
    else if (this.offset >= 0 && ( remainder < required )) {
        this.context.drawImage(
            structure.canvas,
            this.offset,
            0,
            remainder,
            structure.canvas.height,
            0,
            0,
            remainder,
            this.canvas.height
        );
        this.context.drawImage(
            structure.canvas,
            0,
            0,
            (required - remainder),     // structure width
            structure.canvas.height,    //structure height
            (this.canvas.width - (required-remainder)),
            0,
            (required - remainder),
            this.canvas.height
        );
    }
    // CASE 3: THE OFFSET IS NEGATIVE
    else if(this.offset < 0){
        this.context.drawImage(
            structure.canvas,
            0, 0, this.canvas.width + this.offset, structure.canvas.height,
            -1*this.offset, 0, this.canvas.width + this.offset, structure.canvas.height
        );
        this.context.drawImage(
            structure.canvas,
            structure.canvas.width + this.offset, // offset is negative,
            0,
            -1*this.offset,
            structure.canvas.height,
            0,
            0,
            -1*this.offset,
            structure.canvas.height
        );
    }
};


Surface.prototype.touchmove = function (e) { // Swipe left or right.
    var point = e.touches ? e.touches[0] : e;

    if(this.PointX_move){
        var deltaX = this.PointX_move - point.pageX;
        this.offset = this.offset + Math.floor(deltaX);
    }
    this.PointX_move = point.pageX;
};

Surface.prototype.setLastPointX = function (e) {
    var point = e.touches ? e.touches[0] : e;
    this.lastPointX = point.pageX;
};

Surface.prototype.openUrl = function (e) {
    this.PointX_start = null; //reset start and move points, or it will be jumpy
    this.PointX_move = null;
};

Surface.prototype.overlayMove = function (direction) {
    /*
     * When the overlay buttons are clicked, we scroll in the input direction.
     * Get the innerWidht, 'w', divide by 90 to get itterations
     * The reason for '90' is 1/3 of width and the offset is 30px. ((w/3)/30) == w/90 
     */
    var self = this;
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var max_iterations = w/90;

    var iteration = 0;
    var refresh = setInterval(function() {
        if(direction==="left"){
            self.offset -= 30;
        } else {
            self.offset += 30;
        }
        iteration++;
        if (iteration >= max_iterations){
            clearInterval(refresh);
        }
    }, 100);
}


Surface.prototype.makePointer = function (e) {
    var e = window.event || e;

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    var canvas_x = -this.offset + e.pageX;
    if(w <= 800 && h >= w ) {  // Tablet in Portrait mode
        var canvas_y = e.pageY - 110;
    } else {
        var canvas_y = e.pageY;
    }
    

    var normalizer = 15,
        /* 
        * Since the canvas is 15 times as wide as it is tall, I use a 'normalizer' of 15.
        * Also, the TapeDeck is duplicated 3 times on the VisibleCanvas.
        * This is why we use canvas_x and not e.PageX or e.PageY
        */ 
        normalized_x = Math.floor((normalizer + canvas_x/structure.multiplier) % normalizer),
        normalized_y = Math.floor(canvas_y/structure.multiplier);

    /*
     * I have already pre-calculated the hitboxes, based on the layout. This loop goes through
     * the 2d array of hitboxes, and if a click matches a hitbox, we redirect to the corresponding url.
     * Since this 2D array is small, it is quick. However, this method is O(n^2)
     */
    var content_piece, i, j;
    for ( i = 0; i < structure.hitbox.length; i += 1) {
        for( j=0; j < structure.hitbox[i].length; j += 1){
            if(structure.hitbox[i][j][0] == normalized_x && structure.hitbox[i][j][1] == normalized_y){
                if(tiles[i].url.length > 12){
                    this.canvas.style.cursor='pointer';
                } else {
                    this.canvas.style.cursor='not-allowed';
                }
            }
        }
    }
}

Surface.prototype.clickOpenUrl = function (e) {
    //var point = e.touches ? e.touches[0] : e;
    var e = window.event || e;

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var canvas_x = this.offset + e.pageX;

    // A negative offset, greater than e.pageX results in not finding hitboxes.
    // when the canvas_x is negative, take the end of the structure, and add the negative.
    if( canvas_x < 0 ){
        canvas_x = structure.canvas.width + canvas_x;
    }

    if(this.DEBUG){
        console.log("Canvas_x is: " + canvas_x);
        console.log("Start point is: " + this.PointX_start);
        console.log("Move point is: " + this.PointX_move);
    }
    var deltaX = Math.abs(this.PointX_start - this.PointX_move);

    if(this.DEBUG){
        console.log("Delta X is: " + deltaX);
    }
    
    if(w <= 800 && h >= w ) {  // Tablet in Portrait mode
        var canvas_y = e.pageY - 110;
    } else {
        var canvas_y = e.pageY;
    }
    

    if(deltaX < 20){  // if start touch to end touch x was less than 20px, open URL
        var normalizer = 15,
            /* 
            * Since the canvas is 15 times as wide as it is tall, I use a 'normalizer' or 15.
            * Also, the TapeDeck is duplicated 3 times on the VisibleCanvas.
            * This is why we use canvas_x and not e.PageX or e.PageY
            */ 
            normalized_x = Math.floor(( canvas_x/structure.multiplier) % normalizer),
            normalized_y = Math.floor(canvas_y/structure.multiplier);

        /*
         * I have already pre-calculated the hitboxes, based on the layout. This loop goes through
         * the 2d array of hitboxes, and if a click matches a hitbox, we redirect to the corresponding url.
         * Since this 2D array is small, it is quick. However, this method is O(n^2)
         */
        var content_piece, i, j;
        for ( i = 0; i < structure.hitbox.length; i += 1) {
            for( j=0; j < structure.hitbox[i].length; j += 1){
                if(structure.hitbox[i][j][0] == normalized_x && structure.hitbox[i][j][1] == normalized_y){
                    if(this.DEBUG){
                        console.log("FIRE URL: " + tiles[i].url + " and name is " + tiles[i].textLong);
                        console.log("HitBox X VALUE: " + structure.hitbox[i][j][0] + " VS " + normalized_x);
                        console.log("HitBox Y VALUE: " + structure.hitbox[i][j][1] + " VS " + normalized_y);

                        structure.context.fillStyle = "#F00000";
                        this.context.fillRect(
                            e.pageX,
                            canvas_y,
                            25,
                            25
                        );
                    }
                    else{
                        if(tiles[i].url.length > 12){
                            if(tiles[i].newWindow === "true" ){
                                window.open(tiles[i].url);
                            } else {
                                window.location.href = tiles[i].url;
                            }
                        }
                    }
                }
            }
        }
    }

};
