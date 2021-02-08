function Tile(category, textLong, textShort, image, url, displayBanner, newWindow) {
    this.category = category;
    this.textLong = textLong;
    this.textShort = textShort;
    this.image = image;
    this.url = url;
    this.displayBanner = displayBanner;
    this.newWindow = newWindow;
}

Tile.prototype.update = function(tileId) {
    this.category = pool.content[tileId].category;
    this.textLong = pool.content[tileId].textLong;
    this.textShort = pool.content[tileId].textShort;
    this.image = pool.content[tileId].image;
    this.url = pool.content[tileId].url;
    this.displayBanner = pool.content[tileId].displayBanner;
    this.newWindow = pool.content[tileId].newWindow;

    structure.fadeInTile(tileId);
}
