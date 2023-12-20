function generateFixation(duration, postTrial, taskN){
    // Standard fixation object
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "",
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

function shuffleTargets(targets) {
    for (let key in targets){
        targets[key] = jspRand.shuffle(targets[key])
    }
    return targets
}

function genProtoImg(width, height) {
    // prototype stimulus object
    return proto_img_obj = {
        obj_type: 'image',
        file: allStims[0],
        startX: 0,
        startY: 0,
        width: width,
        height: height,
        origin_center: true,
    }
}

function genProtoRect(width, height) {
    // prototype rect object
    return e3_proto_rect_obj = {
        obj_type: 'rect',
        startX: 0,
        startY: 275,
        width: width,
        height: height,
        fill_color: 'black',
        origin_center: true,
    };
}

function gen_time(timelineVar, adaptiveProps) {
    // If we're using adaptive times
    if (adaptiveProps.use) {
        // See what type of trial we have
        trialType = timelineVar
        if (trialType === "adapt") {
            // If it's adaptive then get the time value from the
            // adaptiveTimes object
            return adaptiveProps.adaptTimes[expt1_score];
        } else if (trialType === "reg") {
            // If it's a 'regular' trial then get the time value from
            // the config
            return adaptiveProps.regTime;
        }
    } else {
        // If we're not using adaptive times then just get the supplied 
        // time value
        return timelineVar;
    }
};