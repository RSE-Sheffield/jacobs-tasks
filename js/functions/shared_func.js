function generateFixation(duration, postTrial, taskN){
    // Standard fixation object
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: duration,
        post_trial_gap: postTrial, 
        data: {
            screen: 'fixation',
            task: taskN,
        }
    };
}

// Hide cursor
var cursor_off = {
    type: jsPsychCallFunction,
    func: function() {
        document.body.style.cursor= "none";
    }
}

// Show cursor
var cursor_on = {
    type: jsPsychCallFunction,
    func: function() {
        document.body.style.cursor= "auto";
    }
}

function genTargetsUsedDict(trialCombos, filtVar) {
    let targetsUsed = {}
    let filt_combos = trialCombos.filter(item => item[filtVar] == true);
    let keyArr = filt_combos.map(el => `${el.nStimuli}_${el.timePerItem}`);
    keyArr.forEach(el => {targetsUsed[el] = []});

    return targetsUsed
}

function generateKey(nItems, timePerItem){
    return String(nItems) + "_" + String(timePerItem)
}

function shuffleTargets(targets) {
    for (let key in targets){
        targets[key] = jspRand.shuffle(targets[key])
    }
    return targets
}

function genProtoImg() {
    // prototype stimulus object
    return proto_img_obj = {
        obj_type: 'image',
        file: allStims[0],
        startX: 0,
        startY: 0,
        width: imgSize[0],
        height: imgSize[1],
        origin_center: true,
    }
}