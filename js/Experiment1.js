var [correctCount, incorrectCount] = [0, 0];

const e1Pos = Array.from({length: expt1_config.nPositions}, (_value, index) => index)
var taskN = 1;
var expt1_score;

// Generate fixation object
var fixation = generateFixation(
    expt1_config.fixationDuration,
    expt1_config.fixationPostTrial,
    taskN
);

const e1_proto_rect_obj = {
    obj_type: 'rect', // means a rectangle
    startX: 0, // location in the canvas
    startY: 0,
    width: expt1_config.stimDims[0], // of the rectangle
    height: expt1_config.stimDims[1],
    line_color: 'black',
    fill_color: 'black',
    show_start_time: 0, // from the trial start (ms)
    show_end_time: expt1_config.stimulusDuration,
    origin_center: true,
};

const stimArray = Array(expt1_config.startValue).fill(e1_proto_rect_obj)

// Generate target array
const expt1_array = {
    type: jsPsychPsychophysics,
    stimuli: stimArray,
    response: "button",
    choices: [],
    on_start: function(trial) {

        let nStimuli = stimArray.length;

        // Before each trial randomly select some positions
        let rectPos = jspRand.sampleWithoutReplacement(e1Pos, nStimuli);

        // Then shuffle the available colours and and split into used and unused
        let shuffColours = jspRand.shuffle(expt1_config.colours);
        usedCols = shuffColours.slice(0, nStimuli);
        unusedCols = shuffColours.slice(nStimuli, );
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
            );
            trial.stimuli[i].startX = xPos;
            trial.stimuli[i].startY = yPos;
            // Set fill colour for each stim
            trial.stimuli[i].fill_color = usedCols[i];
        }
    },
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    trial_duration: expt1_config.trialDuration,
    background_color: 'white',
    data: {
        screen: "memory array",
        task: taskN
    },
};

const expt1_probe = {
    type: jsPsychPsychophysics,
    stimuli: [e1_proto_rect_obj],
    response_type: "button",
    button_choices: ["yes", "no"],
    button_html: '<button class="jspsych-btn">%choice%</button>',
    horiz_button_margin: "40px",
    vert_button_margin: "20px",
    on_start: function(trial) {
        if (jsPsych.timelineVariable('novel_probe')) {
            probe_col = usedCols[0];
        } else {
            probe_col = unusedCols[0];
        };
        trial.stimuli[0].fill_color = probe_col;
        trial.stimuli[0].show_end_time = null; 

        trial.data.probe_colour = probe_col;
    },
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    data: {
        screen: "probe",
        task: taskN,
        novel_probe: jsPsych.timelineVariable('novel_probe'),
        expected_response: jsPsych.timelineVariable('expected_response'),
    },
    on_finish: function(data) {

        let nStimuli = stimArray.length;
        data.accuracy = data.response == data.expected_response;
        data.nItems = nStimuli;
        
        // Update nStimuli based on staircase rules set in config file
        if (data.accuracy) {
            correctCount += 1;
            if (correctCount == expt1_config.staircaseUp) {
                [correctCount, incorrectCount] = [0, 0];
                if (nStimuli < expt1_config.maxValue) stimArray.push(e1_proto_rect_obj);
            };
        } else {
            incorrectCount += 1;
            if (incorrectCount == expt1_config.staircaseDown) {
                [correctCount, incorrectCount] = [0, 0];
                if (nStimuli > expt1_config.minValue) stimArray.pop();
            };
        };
    },
};

// Pull items into a single procedure 
const expt1_main = {
    timeline: [
        cursor_off,
        fixation,
        expt1_array,
        cursor_on,
        expt1_probe
    ],
    timeline_variables: [
        {novel_probe: true, expected_response: 0},
        {novel_probe: false, expected_response: 1}
    ],
    sample: {
        type: 'fixed-repetitions',
        size: expt1_config.nTrialReps
    },
};

const expt1_start = {
    type: jsPsychInstructions,
    pages: expt1_inst,
    show_clickable_nav: true,
};

const expt1_prac = {
    timeline: [],
    conditional_function: function() {
        return expt1_config.practice
    },
};

const expt1_end = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Well done, you have finished <strong>Task ' +taskN+ '</strong></p><p>Press the button below when you are ready to move onto the next task</p>',
    choices: ["Continue"],
};

expt1_proc = {
    timeline: [
        expt1_start,
        expt1_prac,
        expt1_main,
        expt1_end,
    ],
    conditional_function: function() {
        return expt1_config.run
    },
    on_timeline_finish: function() {
        // Get all trials so far
        const allTrials = jsPsych.data.allData.trials;
        // Get the most recent number of probe trials specified by adaptLookBack param
        const probeTrials = allTrials.filter(trial => trial.screen === "probe").slice(-expt2_config.adaptLookBack);
        // Find the rounded average value for nTargets over those trials
        expt1_score = Math.round(probeTrials.reduce((sum, obj) => sum + obj["nItems"], 0) / probeTrials.length);
    }
};


mainTimeline.push(expt1_proc);