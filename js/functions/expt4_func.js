////@ts-check
function setupStandalone(targetsUsed, itemsPerCond){
    let allStims = Array.from({length: 454}, (value, index) => index + 1);
    allStims = jspShuffle(allStims);
    targetsUsed = generateTargets(allStims, targetsUsed, itemsPerCond);

    return [allStims, targetsUsed]
}

function generateTargets(allStims, targetsUsed, itemsPerCond){
    // We need to know the number of different conditions (generated from the config file)
    // and number of trials per condition

    // For each condition grab the number of trials from the allStims array and
    // put them in the targetsUsed object under that condition

    for (key of Object.keys(targetsUsed)) {
        values = allStims.slice(0, itemsPerCond);
        allStims = allStims.slice(itemsPerCond);
        targetsUsed[key].push(...values);
    }

    return targetsUsed
}


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
  