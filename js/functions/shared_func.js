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

function genTargetsUsed(trialCombos, filtVar) {
    let targetsUsed = {}
    let filt_combos = trialCombos.filter(item => item[filtVar] == true);
    let keyArr = filt_combos.map(el => `${el.nItems}_${el.timePerItem}`);
    keyArr.forEach(el => {targetsUsed[el] = []});

    return targetsUsed
}
