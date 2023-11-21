var canvasCentre = [canvas.width/2 - imgSize/2, canvas.height/2 - imgSize/2];
var allStims = genImgList(expt2_config.nImages)

var stimArray;
var allStims = Array.from({length: 454}, (value, index) => index + 1)
allStims = jspShuffle(allStims)
var targetsUsed = {};
var key;
var taskN = 2;

// Preload stimuli
const preload = {
    type: jsPsychPreload,
    images: allStims,
}

mainTimeline.push(preload);

// Generate all the different conditions
let expt2_trialCombos = jspRand.factorial({
    nStimuli: expt2_config.nStimuli,
    timePerItem: expt2_config.timePerItem,
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
var meta_capacity = {
    type: jsPsychHtmlButtonResponse,
    on_start: function(trial) {
        let type = jsPsych.timelineVariable('metaOptions')
        let nStimuli = jsPsych.timelineVariable('nStimuli') + 1
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
                trial.prompt = "Please wait"
                trial.choices = []
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
var meta_node = {
    timeline: [meta_capacity],
    conditional_function: function() {
        return expt2_config.metaCapacity
    }
};

// Object for feedback
var feedback = {
    type: jsPsychHtmlButtonResponse,
    trial_duration: expt2_config.feedbackDuration,
    stimulus: function(){
        // The feedback stimulus is a dynamic parameter because we can't know in advance whether
        // the stimulus should be 'correct' or 'incorrect'.
        // Instead, this function will check the accuracy of the last response and use that information to set
        // the stimulus value on each trial.
        if (jsPsych.timelineVariable('showFeedback')) {
            var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
            if(last_trial_correct){
                return "<p>Correct!</p>"; // the parameter value has to be returned from the function
            } else {
                return "<p>Wrong.</p>"; // the parameter value has to be returned from the function
            }
        } else {
            return "<p></p>"
        }
    },
    choices: [],
    data: {
        screen: "feedback"
    }
};

// Conditional node for the feedback
var feedback_node = {
    timeline: [feedback],
    conditional_function: function() {
        return expt2_config.feedback
    }
};

// Generate array of targets
var target_array_expt2 = {
    type: jsPsychCanvasButtonResponse,
    on_start: function(trial){
        var nItems = jsPsych.timelineVariable('nItems');
        var timePerItem = jsPsych.timelineVariable('timePerItem');
        key = String(nItems) + "_" + String(timePerItem);
        stimArray = generateStims(jsPsych.timelineVariable('nItems'));
        if (!(key in targetsUsed)) targetsUsed[key] = [];
    },
    stimulus: function(c) {
        drawStims(c, stimArray);
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
var response_display_expt2 = {
    type: jsPsychCanvasButtonResponse,
    on_start: function(trial) {
        probe = generateWMprobe(jsPsych.timelineVariable('probePresent'));
    },
    stimulus: function(c) {
        drawStims(c, [probe]);
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
        
        targetsUsed[key].push(...stimArray)
    },
};

// Pull items into a single procedure
var expt2_procedure = {
    timeline: [
        cursor_off,
        fixation_expt2,
        target_array_expt2,
        cursor_on,
        meta_node,
        response_display_expt2,
        feedback_node
    ],
    timeline_variables: trialCombos_expt2,
    sample: {
        type: 'fixed-repetitions',
        size: expt2_config.nTrialReps,
    },
}; 

// TODO: Need to add a way of incorporating Meta-capacity prompts and feedback conditionally into timeline based on config

mainTimeline.push(expt2_procedure);
