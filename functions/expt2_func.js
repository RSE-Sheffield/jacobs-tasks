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

function generatePosition(posNumber, radius) {
    // This returns position relative to the centre of a circle, and will
    // have to be translated to absolute canvas position
    posInRad = posNumber*Math.PI/4
    xPos = Math.round(Math.cos(posInRad) * radius) - imgSize/2;
    yPos = Math.round(Math.sin(posInRad) * radius) - imgSize/2;

    return([xPos, yPos])
};

function drawImages(c, stimArray) {
    const ctx = c.getContext("2d");
    ctx.translate(...canvasCentre);
    stimArray.forEach((stim) => stim.drawImage(ctx));
};
  