////@ts-check

function generateTargets(allStims, targetsUsed, itemsPerCond){
    // We need to know the number of different conditions (generated from the config file)
    // and number of trials per condition

    // For each condition grab the number of trials from the allStims array and
    // put them in the targetsUsed object under that condition

    for (let key in targetsUsed) {
        stims = allStims.slice(0, itemsPerCond);
        allStims = allStims.slice(itemsPerCond);
        targetsUsed[key].push(...stims);
    }

    return [allStims, targetsUsed]
};

function genImgList(nImages, filePath = "./img/Picture", fileExt = ".png", shuffle = true) {
    // Generate list of images
    let allNums = Array.from({length: nImages}, (_value, index) => (index + 1))
    let allImgs = allNums.map((el) => filePath + el + fileExt)

    if (shuffle) allImgs = jspRand.shuffle(allImgs)

    return allImgs
}
