const imgSize = 96;
var canvasCentre = [canvas.width/2 - imgSize/2, canvas.height/2 - imgSize/2];
const positionArr = [1, 2, 3, 4, 5, 6, 7, 8];

let stimArray;
let allStims = Array.from({length: 454}, (value, index) => index + 1)
allStims = jspShuffle(allStims)
var taskN = 2;

// Generate all the different conditions
let trialCombos = jsPsych.randomization.factorial({
    nItems: expt2_config.nItems,
    timePerItem: expt2_config.timePerItem,
    probePresent: expt2_config.probePresent
})

// Generate fixation object
var fixation = generateFixation(
    expt2_config.fixationDuration,
    expt2_config.fixationPostTrial,
    taskN
);

// Generate array of targets
var target_array = {
    type: jsPsychCanvasButtonResponse,
    on_start: function(trial){
        stimArray = generateStims(jsPsych.timelineVariable('nItems'));
    },
    stimulus: function(c) {
        drawImages(c, stimArray);
    },
    canvas_size: [canvas.width, canvas.height],
    choices: [],
    trial_duration: function(){
        return jsPsych.timelineVariable('nItems') * jsPsych.timelineVariable('timePerItem');
    },
    post_trial_gap: expt2_config.arrayPostTrial,
    data: {
        screen: 'memory array',
        task: taskN
    },
};

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
    choices: expt2_config.responseOptions,
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
    },
};

// Pull items into a single procedure
var expt2_procedure = {
    timeline: [
        cursor_off,
        fixation,
        target_array,
        cursor_on,
        response_display
    ],
    timeline_variables: trialCombos,
    sample: {
        type: 'fixed-repetitions',
        size: expt2_config.nTrialReps,
    },
}; 

// TODO: Need to add a way of incorporating Meta-capacity prompts and feedback conditionally into timeline based on config

mainTimeline.push(expt2_procedure);
