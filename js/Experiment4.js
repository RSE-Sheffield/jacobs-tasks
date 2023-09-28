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
var response_display_expt4 = {
    type: jsPsychCanvasButtonResponse,
    on_start: function(trial) {
        key = generateKey(
            jsPsych.timelineVariable('nItems'),
            jsPsych.timelineVariable('timePerItem')
        )

        probe = generateLTMprobe(
            jsPsych.timelineVariable('novelStim'),
            targetsUsed,
            key
        );
    },
    stimulus: function(c) {
        drawStims(c, [probe])
    },
    canvas_size: [canvas.width, canvas.height],
    choices: expt4_config.responseOptions,
    button_html: [
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
    ],
    data: {
        screen: 'probe',
        task: taskN,
        nItems: jsPsych.timelineVariable('nItems'),
        timePerItem: jsPsych.timelineVariable('timePerItem'),
        probePresent: jsPsych.timelineVariable('novelStim')

    },
    on_finish: function(data) {
        data.Stimulus = probe.path.split("/").pop();
        data.responseProbeSeen = data.response < 3;
        if (data.responseProbeSeen === 1) {
            data.responseConfidence = data.response % 3
        } else {
            data.responseConfidence = 6 - data.response % 3
        }
        data.correct = ((data.probePresent & data.responseProbeSeen) | (!data.probePresent & !data.responseProbeSeen));
    },
};

// Pull items into a single procedure
var expt4_procedure = {
    timeline: [
        cursor_off,
        fixation_expt4,
        cursor_on,
        response_display_expt4
    ],
    timeline_variables: trialCombos_expt4,
    sample: {
        type: 'fixed-repetitions',
        size: expt4_config.nTrialReps,
    },
}; 

// TODO: Need to add a way of incorporating Meta-capacity prompts and feedback conditionally into timeline based on config

mainTimeline.push(expt4_procedure);
