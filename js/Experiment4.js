var key;
var taskN = 4;

// Generate all the different conditions
let expt4_trialCombos = jspRand.factorial({
    nStimuli: expt2_config.nStimuli,
    timePerItem: encodeTime,
    consolidationTime: consolTime,
    novel_probe: expt2_config.novelProbe
})

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
        '<button class="jspsych-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn-yes">%choice%</button>',
        '<button class="jspsych-btn colour-btn-no">%choice%</button>',
        '<button class="jspsych-btn colour-btn-no">%choice%</button>',
        '<button class="jspsych-btn colour-btn-no">%choice%</button>',
    ],
    canvas_width: canvas.width,
    canvas_height: canvas.height,
    background_color: 'white',
    data: {
        screen: 'probe',
        task: taskN,
        novel_probe: jsPsych.timelineVariable('novel_probe')
    },
    stimuli: function() {
        let probe = genProtoImg(...expt4_config.stimulusDims);
        const novel_probe = jsPsych.timelineVariable('novel_probe');
        if (novel_probe) {
            probe.file = allStims.pop();
        } else {
            const nItems = jsPsych.timelineVariable('nStimuli');

            let encodeTime = genTime(
                jsPsych.timelineVariable('timePerItem'),
                expt2_config.adaptiveEncode
            );

            let consolTime = genTime(
                jsPsych.timelineVariable('consolidationTime'),
                expt2_config.adaptiveConsol
            );

            let key = String(nItems) + "_E" + String(encodeTime) + "_C" + String(consolTime);

            probe.file = targetsUsed[key].pop();
        }
        return [probe]
    },
    on_start: function(trial) {
        // Get the filename without the leading dir
        trial.data.stimulus = trial.stimuli[0].file.split("/").pop();
    },
    on_finish: function(data) {

        if (!jsPsych.timelineVariable('novel_probe')) {
            data.nItems = jsPsych.timelineVariable('nStimuli');

            data.encode_time = genTime(
                jsPsych.timelineVariable('timePerItem'),
                expt2_config.adaptiveEncode
            );

            data.consol_time = genTime(
                jsPsych.timelineVariable('consolidationTime'),
                expt2_config.adaptiveConsol
            );
        };

        // 'Yes' is one of the 1st 3 buttons (differing confidence levels)
        data.probe_seen = data.response < 3;
        // Seperate out different confidence levels
        if (data.probe_seen === 1) {
            data.responseConfidence = data.response % 3;
        } else {
            // 2nd half of confidence levels are reversed
            data.responseConfidence = (6 - data.response) % 3;
        }
        data.accuracy = ((data.novel_probe & !data.probe_seen) | (!data.novel_probe & data.probe_seen));
    },
};


// Pull items into a single procedure
const expt4_main = {
    timeline: [
        cursor_off,
        fixation_expt4,
        cursor_on,
        expt4_response
    ],
    timeline_variables: expt4_trialCombos,
    sample: {
        type: 'fixed-repetitions',
        size: expt4_config.nTrialReps,
    },
};

const expt4_start = {
    type: jsPsychInstructions,
    pages: expt4_inst,
    show_clickable_nav: true,
};

const expt4_prac = {
    timeline: [],
    conditional_function: function() {
        return expt4_config.practice
    },
};

const expt4_end = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Well done, you have finished <strong>Task ' +taskN+ '</strong></p><p>Press the button below when you are ready to move onto the next task</p>',
    choices: ["Continue"],
};

const expt4_proc = {
    timeline: [
        expt4_start,
        expt4_prac,
        expt4_main,
        expt4_end,
    ],
    on_timeline_start: function() {
        // Need to generate dummy targetsUsed object for standalone version
        if (Object.keys(targetsUsed).length === 0) {
            // Generate empty dict with different condition keys
            targetsUsed = genTargetsUsedDict(expt4_trialCombos, "novel_probe");
            // Generate shuffled list of all stims
            allStims = genImgList(expt2_config.nImages)
            // Add stims to targetsUsed dict
            allTargets = generateTargets(allStims, targetsUsed, expt4_config.nTrialReps);
            allStims = allTargets[0];
            targetsUsed = allTargets[1];
        } else {
            targetsUsed = shuffleTargets(targetsUsed);
        };
    },
    conditional_function: function() {
        return expt4_config.run
    },
};

mainTimeline.push(expt4_proc);
