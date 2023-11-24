// Experiment will show N stimuli randomly placed across a 4 x 3 grid
// There will be a signal indicating the colour of the stimuli that participantts need to click

// stimuli will appear randomly across the trial
// The number of stimuli will change from trial to trial (staircase?)
// Trials will be repeated for a fixed amount of times (will this need a way to break out immediately?)

let nStim = expt3_config.startingStimN;

const [stimWidth, stimHeight] = expt3_config.stimulusDims;

// Initialise these at the top level so they can be accessed by functions
var targetColour, loopStart;
var clickedColour = "";

const e3_proto_rect_obj = {
    obj_type: 'rect',
    startX: 0,
    startY: 575,
    width: stimWidth,
    height: stimHeight,
    line_color: 'black',
    fill_color: 'black',
    show_start_time: 0,
    show_end_time: expt3_config.maxTrialLengthMs,
};

const expt3_trial = {
    type: jsPsychPsychophysics,
    stimuli: Array(nStim + 1).fill(e3_proto_rect_obj),
    response: "button",
    choices: [],
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    trial_duration: expt3_config.maxTrialLengthMs,
    on_start: function(trial) {
        // Sample non-target colours
        let rectCols = jspRand.sampleWithoutReplacement(shufCols, nStim - 1);
        // Add target colour back to the array
        rectCols.push(targetColour);

        // Sample different positions
        let rectPos = jspRand.sampleWithoutReplacement(expt3_config.allPostions, nStim);

        // This draws the target bar across the bottom of the canvas
        trial.stimuli[0].width = 1600; // Not sure why this is double the width of the canvas
        trial.stimuli[0].height = 25;
        trial.stimuli[0].fill_color = targetColour;

        // This draws the individual stimuli on the canvas
        for (let i = 1; i < trial.stimuli.length; i++) {
            var [xPos, yPos] = generatePosGrid(
                rectPos[i-1],
                expt3_config.squareDims,
                expt3_config.posJitterRange
            )
            
            // Generate random start and end times
            let startTime = jspRand.randomInt(...expt3_config.startTimeRangeMs);
            let endTime = startTime + jspRand.randomInt(...expt3_config.durationRangeMs);
            
            // Update the stimulus location
            trial.stimuli[i].startX = xPos;
            trial.stimuli[i].startY = yPos;
            // Update the stimulus colour
            trial.stimuli[i].fill_color = rectCols[i-1];
            // Update the stimulus start and end time
            trial.stimuli[i].show_start_time = startTime;
            trial.stimuli[i].show_end_time = endTime;
        }
    },
    mouse_down_func: function(event) {
        let x = event.offsetX;
        let y = event.offsetY;

        for (let i = 1; i < trial.stimuli.length; i++) {
            let x1 = jsPsych.getCurrentTrial().stim_array[i].startX - (stimWidth/2);
            let x2 = x1 + stimWidth;

            let y1 = jsPsych.getCurrentTrial().stim_array[i].startY - (stimHeight/2);
            let y2 = y1 + stimHeight;

            let inX = x1 < x & x < x2;
            let inY = y1 < y & y < y2;

            if (inX & inY) {
                clickedColour = jsPsych.getCurrentTrial().stim_array[i].fill_color;
                jsPsych.getCurrentTrial().end_trial();
            }

        }
    },
    on_finish: function(data) {
        // Record target and clicked colours
        data.target = targetColour;
        data.response = clickedColour;
        if (clickedColour === "") {
            // No Response
            data.correct = -1;
        } else if (clickedColour === targetColour) {
            // Correct response
            data.correct = 1;
        } else {
            // Incorrect response
            data.correct = 0;
        }
        clickedColour = "";
    },
};

const loop_node = {
    // Repeat the trial until the keepLooping function returns False
    timeline: [expt3_trial],
    loop_function: function() {
        return keepLooping(loopStart, expt3_config.blockTimeLimitMs);
    },
};

function keepLooping(loopStart, limitMs) {
    // Checks to see if the time since 'loopStart' is less that the 'limitSecs'
    let currTime = new Date();
    let elapsedMs = currTime - loopStart;
    return elapsedMs < limitMs
};

const start_timeline = {
    type: jsPsychCallFunction,
    func: function() {
        // Set start time for looping block
        loopStart = new Date();

        // Set target colour for this block
        shufCols = jspRand.shuffle(expt3_config.allColours);
        targetColour = shufCols.shift();
    },
};

const top_node = {
    timeline: [start_timeline, loop_node],
    repetitions: expt3_config.loopRepetitions,
};

mainTimeline.push(top_node);