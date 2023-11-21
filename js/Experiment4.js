var canvasCentre = [canvas.width/2 - imgSize/2, canvas.height/2 - imgSize/2];
var key;
var taskN = 4;

// Generate all the different conditions
let trialCombos_expt4 = jsPsych.randomization.factorial({
    nItems: expt4_config.nItems,
    timePerItem: expt4_config.timePerItem,
    novelStim: expt4_config.novelStim
})

// Need to generate dummy targetsUsed object for standalone version
if (typeof(targetsUsed) === 'undefined') {
    var targetsUsed = genTargetsUsed(trialCombos_expt4, "novelStim");
    var [allStims, targetsUsed] = setupStandalone(targetsUsed, expt4_config.nTrialReps);
} else {
    targetsUsed = shuffleTargets(targetsUsed);
}


// Generate fixation object
var fixation_expt4 = generateFixation(
    expt4_config.fixationDuration,
    expt4_config.fixationPostTrial,
    taskN
);

// Generate the response display
const expt4_response = {
    type: jsPsychPsychophysics,
    response_type: "button",
    button_choices: expt4_config.responseOptions,
    button_html: [
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
    ],
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    data: {
        screen: 'probe',
        task: taskN,
        nItems: jsPsych.timelineVariable('nStimuli'),
        timePerItem: jsPsych.timelineVariable('timePerItem'),
        novelStim: jsPsych.timelineVariable('novelStim')
    },
    stimuli: function() {
        let probe = genProtoImg();
        const novelStim = jsPsych.timelineVariable('novelStim');
        if (novelStim) {
            probe.file = allStims.pop();
        } else {
            const nItems = jsPsych.timelineVariable('nStimuli');
            const  timePerItem = jsPsych.timelineVariable('timePerItem');
            let key = String(nItems) + "_" + String(timePerItem);

            probe.file = targetsUsed[key].pop();
        }
        return [probe]
    },
    on_start: function(trial) {
        // Get the filename without the leading dir
        trial.data.stim = trial.stimuli[0].file.split("/").pop()
    },
    on_finish: function(data) {
        // 'Yes' is one of the 1st 3 buttons (differing confidence levels)
        data.responseProbeSeen = data.response < 3;
        // Seperate out different confidence levels
        if (data.responseProbeSeen === 1) {
            data.responseConfidence = data.response % 3
        } else {
            // 2nd half of confidence levels are reversed
            data.responseConfidence = (6 - data.response) % 3
        }
        data.correct = ((data.probePresent & data.responseProbeSeen) | (!data.probePresent & !data.responseProbeSeen));
    },
}


// Pull items into a single procedure
var expt4_procedure = {
    timeline: [
        cursor_off,
        fixation_expt4,
        cursor_on,
        expt4_response
    ],
    timeline_variables: trialCombos_expt4,
    sample: {
        type: 'fixed-repetitions',
        size: expt4_config.nTrialReps,
    },
}; 

// TODO: Need to add a way of incorporating Meta-capacity prompts and feedback conditionally into timeline based on config

mainTimeline.push(expt4_procedure);
