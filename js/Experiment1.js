var canvasCentre = [canvas.width/2 - expt1_config.stimSize/2, canvas.height/2 - expt1_config.stimSize/2]
var [correctCount, incorrectCount] = [0, 0];

var nStimuli = expt1_config.startValue

// Generate fixation object
var fixation = generateFixation(
    expt1_config.fixationDuration,
    expt1_config.fixationPostTrial
);

// Generate target array
var target_array = {
    type: jsPsychCanvasButtonResponse,
    // Befre each run shuffle the available colours and split into used
    // and unused
    on_start: function(trial){
        shuffColours = jspShuffle(expt1_config.colours)
        usedCols = shuffColours.slice(0, nStimuli)
        unusedCols = shuffColours.slice(nStimuli, )
    },
    // Draw the used colours on screen
    stimulus: function(c) {
        drawRects(c, usedCols);
    },
    canvas_size: [canvas.width, canvas.height],
    trial_duration: expt1_config.stimulusDuration,
    post_trial_gap: expt1_config.blankDuration,
    data: {
        screen: "memory array"
    },
    choices: []
}

// generate response display
var response_display = {
    type: jsPsychCanvasButtonResponse,
    // before the trial decide whether the probe will come from the
    // used or unused colours (based on TL variable)
    on_start: function(trial) {
        if (jsPsych.timelineVariable('probe_present')) {
            probe_col = usedCols[0];
        } else {
            probe_col = unusedCols[0];
        }
    },
    // Draw the probe rectangle
    stimulus: function(c) {
        drawRect(c, ...canvasCentre, expt1_config.stimSize, probe_col);
    },
    data: {
        screen: "probe",
        probe_present: jsPsych.timelineVariable('probe_present'),
        correct_response: jsPsych.timelineVariable('correct_response'),
    },
    // Add more info to the data object, but these things are only
    // available after the trial has finished
    on_finish: function(data) {
        data.probe_colour = probe_col
        data.correct = data.response == data.correct_response
        data.nTargets = nStimuli

        // Update nStimuli based on staircase rules set in config file
        if (data.correct) {
            correctCount += 1;
            if (correctCount == expt1_config.staircaseUp) {
                [correctCount, incorrectCount] = [0, 0];
                if (nStimuli < expt1_config.maxValue) nStimuli += 1;
            }
        } else {
            incorrectCount += 1;
            if (incorrectCount == expt1_config.staircaseDown) {
                [correctCount, incorrectCount] = [0, 0];
                if (nStimuli > expt1_config.minValue) nStimuli -= 1;
            }
        }
    },
    canvas_size: [canvas.width, canvas.height],
    choices: ["yes", "no"],
    button_html: [
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
    ],
    margin_horizontal: "40px",
    margin_vertical: "20px",

}

// Pull items into a single procedure 
var expt1_procedure = {
    timeline: [
        cursor_off,
        fixation,
        target_array,
        cursor_on,
        response_display
    ],
    timeline_variables: [
        {probe_present: true, correct_response: 0},
        {probe_present: false, correct_response: 1}
    ],
    sample: {
        type: 'fixed-repetitions',
        size: expt1_config.nTrialReps
    },
};

// TODO: Need to add a way to pass the outcome (final number of items) of this task to a later task 

mainTimeline.push(expt1_procedure)