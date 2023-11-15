var [correctCount, incorrectCount] = [0, 0];

const e1Pos = Array.from({length: expt1_config.nPositions}, (_value, index) => index)
const taskN = 1;
const [stimWidth, stimHeight] = expt1_config.stimDims;

// Generate fixation object
var fixation = generateFixation(
    expt1_config.fixationDuration,
    expt1_config.fixationPostTrial,
    taskN
);

const proto_rect_obj = {
    obj_type: 'rect', // means a rectangle
    startX: 0, // location in the canvas
    startY: 0,
    width: stimWidth, // of the rectangle
    height: stimHeight,
    line_color: 'black',
    fill_color: 'black',
    show_start_time: 0, // from the trial start (ms)
    show_end_time: expt1_config.stimulusDuration,
    origin_center: true,
}

const stimArray = Array(expt1_config.startValue).fill(proto_rect_obj)

// Generate target array
var expt1_array = {
    type: jsPsychPsychophysics,
    stimuli: stimArray,
    response: "button",
    choices: [],
    on_start: function(trial) {

        let nStimuli = stimArray.length

        // Before each trial randomly select some positions
        let rectPos = jspRand.sampleWithoutReplacement(e1Pos, nStimuli)

        console.log(rectPos)

        // Then shuffle the available colours and and split into used and unused
        let shuffColours = jspRand.shuffle(expt1_config.colours)
        usedCols = shuffColours.slice(0, nStimuli)
        unusedCols = shuffColours.slice(nStimuli, )
        // Used will be presented in array
        // single colour from unused will be presented when the probe
        // wasn't present in the target array

        for (let i = 0; i < trial.stimuli.length; i++) {
            // Generate and set x and y positions for each stim
            var [xPos, yPos] = generatePosCircle(
                rectPos[i],
                expt1_config.radius,
                expt1_config.radiusJitter,
                expt1_config.angleJitter
            )
            trial.stimuli[i].startX = xPos
            trial.stimuli[i].startY = yPos
            // Set fill colour for each stim
            trial.stimuli[i].fill_color = usedCols[i]
        }
        console.log(trial.stimuli)
    },
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    trial_duration: expt1_config.trialDuration,
    background_color: 'white',
    data: {
        screen: "memory array",
        task: taskN
    },
}

let probe_rect_obj = {
    obj_type: 'rect', // means a rectangle
    startX: 0, // location in the canvas
    startY: 0,
    width: stimWidth, // of the rectangle
    height: stimHeight,
    line_color: 'black',
    fill_color: 'black',
    origin_center: true,
}

var expt1_probe = {
    type: jsPsychPsychophysics,
    stimuli: [probe_rect_obj],
    response_type: "button",
    button_choices: ["yes", "no"],
    button_html: [
        '<button class="jspsych-btn colour-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn colour-btn-no">%choice%</button>',
    ],
    horiz_button_margin: "40px",
    vert_button_margin: "20px",
    on_start: function(trial) {
        if (jsPsych.timelineVariable('probe_present')) {
            probe_col = usedCols[0];
        } else {
            probe_col = unusedCols[0];
        }        
        trial.stimuli[0].fill_color = probe_col;
        trial.data.probe_colour = probe_col;
    },
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    data: {
        screen: "probe",
        task: taskN,
        probe_present: jsPsych.timelineVariable('probe_present'),
        correct_response: jsPsych.timelineVariable('correct_response'),
    },
    on_finish: function(data) {

        let nStimuli = stimArray.length
        data.correct = data.response == data.correct_response
        data.nTargets = nStimuli
        
        // Update nStimuli based on staircase rules set in config file
        if (data.correct) {
            correctCount += 1;
            if (correctCount == expt1_config.staircaseUp) {
                [correctCount, incorrectCount] = [0, 0];
                if (nStimuli < expt1_config.maxValue) stimArray.push(proto_rect_obj);
            }
        } else {
            incorrectCount += 1;
            if (incorrectCount == expt1_config.staircaseDown) {
                [correctCount, incorrectCount] = [0, 0];
                if (nStimuli > expt1_config.minValue) stimArray.pop();
            }
        }
    },
};

// Pull items into a single procedure 
var expt1_procedure = {
    timeline: [
        cursor_off,
        fixation,
        expt1_array,
        cursor_on,
        expt1_probe
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