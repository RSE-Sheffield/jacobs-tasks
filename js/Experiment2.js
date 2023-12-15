const e2pos = Array.from({length: expt2_config.nPos}, (_value, index) => (index));

var usedStims, key;
var targetsUsed = {};
var taskN = 2;
var stimDuration;

// If we are using adaptive then use a placeholder value which will be
// replaced by the value corresponding to  task 1 score
// Otherwise use the value(s) from the expt2_config

let encodeTime = expt2_config.adaptiveEncode.use ?
                    expt2_config.adaptivePlaceholder :
                    expt2_config.timePerItem

let consolTime = expt2_config.adaptiveConsol.use ? 
                    expt2_config.adaptivePlaceholder :
                    expt2_config.consolidationTime


// Generate all the different conditions
let expt2_trialCombos = jspRand.factorial({
    nStimuli: expt2_config.nStimuli,
    timePerItem: encodeTime,
    consolidationTime: consolTime,
    probePresent: expt2_config.probePresent,
    ...(expt2_config.metaCapacity? {metaOptions: expt2_config.metaOptions}: {}),
    ...(expt2_config.feedback? {showFeedback: expt2_config.showFeedbackOptions}: {}),
})

// Generate fixation object
var fixation_expt2 = generateFixation(
    expt2_config.fixationDuration,
    expt2_config.fixationPostTrial,
    taskN
);

// Object for meta-capacity prompt
const meta_capacity = {
    type: jsPsychHtmlButtonResponse,
    on_start: function(trial) {
        let type = jsPsych.timelineVariable('metaOptions');
        let nStimuli = jsPsych.timelineVariable('nStimuli') + 1;
        switch(type) {
            case "number":
                trial.prompt = "Select your capacity";
                trial.choices = Array.from({length: nStimuli}, (_value, index) => index);
                break;
            case "letter":
                letters = jspRand.shuffle(expt2_config.metaLetters.slice(0, nStimuli));
                trial.prompt = "Find the letter A";
                trial.choices = letters;
                break;
            case "delay":
                trial.prompt = "Please wait";
                trial.choices = [];
                break
        }
    },
    stimulus: "<div>",
    choices: [],
    prompt: "",
    trial_duration: expt2_config.metaDuration,
    response_ends_trial: false,
    button_html: '<button class="jspsych-btn colour-btn">%choice%</button>',
    data: {
        screen: "meta"
    }
};

// Node contianing just meta-capacity, with conditional function that
// determines whether it is used from flag in config.
const meta_node = {
    timeline: [meta_capacity],
    conditional_function: function() {
        return expt2_config.metaCapacity
    },
};

// Object for feedback
const feedback = {
    type: jsPsychHtmlButtonResponse,
    trial_duration: expt2_config.feedbackDuration,
    stimulus: function() {
        // The feedback stimulus is a dynamic parameter because we can't know in advance whether
        // the stimulus should be 'correct' or 'incorrect'.
        // Instead, this function will check the accuracy of the last response and use that information to set
        // the stimulus value on each trial.
        if (jsPsych.timelineVariable('showFeedback')) {
            var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
            if(last_trial_correct) {
                return '<img src=' +expt2_config.feedbackImgs[0]+ ' width="200" height="200"><h2>Correct!</h2>'; // the parameter value has to be returned from the function
            } else {
                return '<img src=' +expt2_config.feedbackImgs[1]+ ' width="200" height="200"><h2>Incorrect</h2>'; // the parameter value has to be returned from the function
            };
        } else {
            return "<p></p>"
        };
    },
    choices: [],
    data: {
        screen: "feedback",
    }
};

// Conditional node for the feedback
const feedback_node = {
    timeline: [feedback],
    conditional_function: function() {
        return expt2_config.feedback
    },
};

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
            // If it's a regular trial then get the  time value from
            // the config
            return adaptiveProps.regTime;
        }
    } else {
        // If we're not using adaptive times then just get the supplied 
        // time value
        return timelineVar;
    }
};

// Generate array of targets
const expt2_array = {
    type: jsPsychPsychophysics,
    response: "button",
    choices: [],
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    data: {
        screen: "memory array",
        task: taskN
    },
    stimuli: function() {
        let nStimuli = jsPsych.timelineVariable('nStimuli')

        let encodeTime = gen_time(
            jsPsych.timelineVariable('timePerItem'),
            expt2_config.adaptiveEncode);

        // Get the overall stim duration time
        stimDuration = nStimuli * encodeTime;
        let currStims = [];

        let rectPos = jspRand.sampleWithoutReplacement(e2pos, nStimuli);

        usedStims = allStims.slice(0, nStimuli);
        allStims = allStims.slice(nStimuli, );

        for (let i = 0; i < nStimuli; i++) {
            // This deep-copies the object each time else you end up with
            // the same properties for all objects
            stim = genProtoImg();
            
            // Generate and set x and y positions for each stim
            var [xPos, yPos] = generatePosCircle(
                rectPos[i],
                expt2_config.radius,
                expt2_config.radiusJitter,
                expt2_config.angleJitter,
                expt2_config.nPos
            );
            stim.startX = xPos;
            stim.startY = yPos;
            stim.show_end_time = stimDuration;

            // Set fill colour for each stim
            stim.file = usedStims[i];
            currStims.push(stim);
        }
        return currStims
    },
    on_start: function(trial) {
        // Generate key for condition and add to targetsUsed dict if not
        // already there
        var nItems = jsPsych.timelineVariable('nStimuli');

        let encodeTime = gen_time(
            jsPsych.timelineVariable('timePerItem'),
            expt2_config.adaptiveEncode);

        let consolTime = gen_time(
            jsPsych.timelineVariable('consolidationTime'),
            expt2_config.adaptiveConsol);
        
        key = String(nItems) + "_E" + String(encodeTime) + "_C" + String(consolTime);
        if (!(key in targetsUsed)) targetsUsed[key] = [];

        // Stimuli aren't saved here yet as what gets saved will depend on probe
    },
    trial_duration: function(){
        let consolTime = gen_time(
            jsPsych.timelineVariable('consolidationTime'),
            expt2_config.adaptiveConsol);

        return stimDuration + consolTime
    },
};

// Generate the response display
const expt2_response = {
    type: jsPsychPsychophysics,
    response_type: "button",
    button_choices: expt2_config.responseOptions,
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
        probePresent: jsPsych.timelineVariable('probePresent')
    },
    stimuli: function() {
        let probe = genProtoImg();
        const probePresent = jsPsych.timelineVariable('probePresent');

        if (probePresent) {
            probe.file = usedStims.pop();
        } else {
            probe.file = allStims.pop();
        }

        return [probe]
    },
    on_start: function(trial) {
        // Get the filename without the leading dir
        trial.data.stim = trial.stimuli[0].file.split("/").pop();
    },
    on_finish: function(data) {
        data.encodeTime = gen_time(
            jsPsych.timelineVariable('timePerItem'),
            expt2_config.adaptiveEncode);

        data.consolTime = gen_time(
            jsPsych.timelineVariable('consolidationTime'),
            expt2_config.adaptiveConsol);

        // 'Yes' is one of the 1st 3 buttons (differing confidence levels)
        data.responseProbeSeen = data.response < 3;
        // Seperate out different confidence levels
        if (data.responseProbeSeen === 1) {
            data.responseConfidence = data.response % 3;
        } else {
            // 2nd half of confidence levels are reversed
            data.responseConfidence = (6 - data.response) % 3;
        }
        data.correct = ((data.probePresent & data.responseProbeSeen) | (!data.probePresent & !data.responseProbeSeen));
        
        // Now save the images used
        targetsUsed[key].push(...usedStims);
    },
};

// Pull items into a single procedure
const expt2_main = {
    timeline: [
        cursor_off,
        fixation_expt2,
        expt2_array,
        cursor_on,
        meta_node,
        expt2_response,
        feedback_node
    ],
    timeline_variables: expt2_trialCombos,
    sample: {
        type: 'fixed-repetitions',
        size: expt2_config.nTrialReps,
    },
}; 

const expt2_start = {
    type: jsPsychInstructions,
    pages: expt2_inst,
    show_clickable_nav: true,
};

const expt2_prac = {
    timeline: [],
    conditional_function: function() {
        return expt2_config.practice
    },
};

const expt2_end = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Well done, you have finished <strong>Task ' +taskN+ '</strong></p><p>Press the button below when you are ready to move onto the next task</p>',
    choices: ["Continue"],
};

const expt2_proc = {
    timeline: [
        expt2_start,
        expt2_prac,
        expt2_main,
        expt2_end,
    ],
    conditional_function: function() {
        return expt2_config.run
    }
}

mainTimeline.push(expt2_proc);
