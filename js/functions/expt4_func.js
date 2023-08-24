////@ts-check
function setupStandalone(){
    let allStims = Array.from({length: 454}, (value, index) => index + 1)
    allStims = jspShuffle(allStims)
    let targetsUsed = generateTargets(allStims);

}

// Need function to generate targets

function stimStruct(img_number) {
    this.path = "./img/Picture" + img_number + ".png";
    this.position = [0, 0];
    this.drawImage = function(ctx) {
        var img = document.createElement("img");
        img.src = this.path;
        img.onload = () => {ctx.drawImage(img, ...this.position);};
    }
};

function drawImages(c, stimArray) {
    const ctx = c.getContext("2d");
    ctx.translate(...canvasCentre);
    stimArray.forEach((stim) => stim.drawImage(ctx));
};

function generateStims(nStims){
    const stimArray = []
    const imgArray = allStims.slice(0, nStims)
    allStims = allStims.slice(nStims)
    const posArray = jspShuffle(positionArr).slice(0, nStims)
    for  (let i = 0; i < nStims; i++) {
        const stim = new stimStruct(imgArray[i], posArray[i])
        stimArray.push(stim)
    }
    return stimArray
};

function generateProbe(probePresent) {
    var probe;
    if (probePresent) {
        probe = stimArray.pop();
        probe.position = [0, 0]
    } else {
        probe = new stimStruct(allStims.pop(), 0);
        allStims = allStims.slice(1)
    }
    return probe
};
  