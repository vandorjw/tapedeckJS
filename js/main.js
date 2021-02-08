if ( !window.requestAnimationFrame ) {
 
    window.requestAnimationFrame = ( function() {
 
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
 
            window.setTimeout( callback, 1000 / 60 );
 
        };
 
    } )();
 
}

window.onload = function () {
    init();

    var rightMove = document.getElementById("canvas_move_right");
    rightMove.addEventListener('touchstart', function (){
        surface.overlayMove('right');
    }, false);
    rightMove.addEventListener('touchend', function (){
        surface.overlayStopMove();
    }, false);
    var leftMove = document.getElementById("canvas_move_left");
    leftMove.addEventListener('touchstart', function (){
        surface.overlayMove('left');
    }, false);
    leftMove.addEventListener('touchend', function (){
        surface.overlayStopMove();
    }, false);

}

window.onresize = function () {
    structure.fitCanvasToViewport();
    structure.setMultiplier();
    surface.fitCanvasToViewport();
    structure.redraw();
}

$( document ).ajaxComplete(function() {
    pool.update();
    window.requestAnimationFrame(draw);
});

function init() {
    surface = new Surface();
    surface.attachListeners();
    tiles = Array(17);
    structure = new Structure();
    structure.fitCanvasToViewport();
    structure.setMultiplier();

    loadingImage = document.querySelector("#preload");
    preload = new Image();
    preload.src = loadingImage.src;

    bannerTail = document.querySelector("#banner-tail");
    tail = new Image();
    tail.src = bannerTail.src;

    for(var tile = 0; tile < tiles.length; tile++) {
        tiles[tile] = new Tile("", "", "", preload, "", "", "" );
        structure.drawTile(tile);
    }

    pool = new ContentPool();
    pool.update();

    window.requestAnimationFrame(draw);

}

function draw(){

    surface.fitCanvasToViewport();

    surface.draw();

    window.requestAnimationFrame(draw);
}

function category_to_color(category){
    switch(category){
        case "eat":
            return "#63A135";
        case "create":
            return "#D25767";
        case "learn":
            return "#7143A2";
        case "play":
            return "#2F98B5";
        case "inspire":
            return "#F9A71B";
    }
}
