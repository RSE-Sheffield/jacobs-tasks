const imgSize = 96;
var canvasCentre = [canvas.width/2 - imgSize/2, canvas.height/2 - imgSize/2];

var taskN = 4;

// Generate all the different conditions
let trialCombos = jsPsych.randomization.factorial({
    nItems: expt2_config.nItems,
    timePerItem: expt2_config.timePerItem,
    probePresent: expt2_config.probePresent
})

// Generate fixation object
var fixation = generateFixation(
    expt4_config.fixationDuration,
    expt4_config.fixationPostTrial,
    taskN
);

// Generate the response display
var response_display = {
    type: jsPsychCanvasButtonResponse,
    on_start: function(trial) {
        probe = generateProbe(jsPsych.timelineVariable('probePresent'));
    },
    stimulus: function(c) {
        drawImages(c, [probe]);
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
        probePresent: jsPsych.timelineVariable('probePresent')

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
        
        targetsUsed[key].push(...stimArray)
    },
};

// Pull items into a single procedure
var expt4_procedure = {
    timeline: [
        cursor_off,
        fixation,
        cursor_on,
        response_display
    ],
    timeline_variables: trialCombos,
    sample: {
        type: 'fixed-repetitions',
        size: expt4_config.nTrialReps,
    },
}; 

// TODO: Need to add a way of incorporating Meta-capacity prompts and feedback conditionally into timeline based on config

mainTimeline.push(expt4_procedure);
