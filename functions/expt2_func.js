function stimStruct(img_number, posNumber) {
    this.path = "./img/Picture" + img_number + ".png";
    if (posNumber == 0) {
        this.position = [0, 0];
    } else {
        this.position = generatePosition(posNumber, config.radius);
    }
    this.drawImage = function(ctx) {
        var img = document.createElement("img");
        img.src = this.path;
        img.onload = () => {ctx.drawImage(img, ...this.position);};
    }
};