////@ts-check

function stimStruct(img_number, posNumber = 0, radius = 0) {
    // Generates object for each image with attributes related to the path to the image
    // and where the image should be presented on the canvas
    // Includes a method for drawing the image on the canvas

    // Generalised for Expt 2 and 4

    this.path = "./img/Picture" + img_number + ".png";
    if (posNumber == 0) {
        this.position = [0, 0];
    } else {
        this.position = generatePosition(posNumber, radius);
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
    var posInRad = posNumber*Math.PI/4;
    var xPos = Math.round(Math.cos(posInRad) * radius);
    var yPos = Math.round(Math.sin(posInRad) * radius);

    return([xPos, yPos])
};

function drawStims(c, stimArray) {
    // Draw each object in the stimArray to the canvas
    const ctx = c.getContext("2d");
    ctx.translate(...canvasCentre);
    stimArray.forEach((stim) => stim.drawImage(ctx));
};

function generateStims(nStims){
    // Generate a number of stim objects is an array
    // Number of stims determined by the argument nStims

    // Start with empty array
    const stimArray = [];
    
    // Remove nStims from allStims array
    const imgArray = allStims.slice(0, nStims);
    allStims = allStims.slice(nStims);

    // Randomly select nStims worth of positions
    const posArray = jspShuffle(positionArr).slice(0, nStims);

    // For each stim generate a new object and push it to the stimArray
    for  (let i = 0; i < nStims; i++) {
        const stim = new stimStruct(imgArray[i], posArray[i], expt2_config.radius);
        stimArray.push(stim);
    }
    return stimArray
};

function generateWMprobe(probePresent) {
    // Generate probe stimulus for the WM portion (expt2)
    var probe;
    if (probePresent) {
        probe = stimArray.pop();
        probe.position = [0, 0];
    } else {
        probe = new stimStruct(allStims.pop());
        allStims = allStims.slice(1);
    }
    return probe
};

function generateLTMprobe(novelStim, targetsUsed, key) {
    var stim;
    if (novelStim) {
        stim = new stimStruct(allStims.pop());
    } else {
        stim = targetsUsed[key].pop();
        stim.position = [0, 0]
    }
    return stim
};

function setupStandalone(targetsUsed, itemsPerCond){
    let allStims = Array.from({length: 454}, (value, index) => index + 1);
    allStims = jspShuffle(allStims);
    targetsUsed = generateTargets(allStims, targetsUsed, itemsPerCond);

    return [allStims, targetsUsed]
};

function generateTargets(allStims, targetsUsed, itemsPerCond){
    // We need to know the number of different conditions (generated from the config file)
    // and number of trials per condition

    // For each condition grab the number of trials from the allStims array and
    // put them in the targetsUsed object under that condition

    for (let key in targetsUsed) {
        stims = allStims.slice(0, itemsPerCond).map(item => new stimStruct(item));
        allStims = allStims.slice(itemsPerCond);
        targetsUsed[key].push(...stims);
    }

    return targetsUsed
};

function genImgList(nImages, filePath = "./img/Picture", fileExt = ".png", shuffle = true) {
    // Generate list of images
    let allNums = Array.from({length: nImages}, (_value, index) => (index + 1))
    let allImgs = allNums.map((el) => filePath + el + fileExt)

    if (shuffle) allImgs = jspRand.shuffle(allImgs)

    return allImgs
}
