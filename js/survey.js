const survey_trial = {
    type: jsPsychSurvey,
    survey_json: survey_json
};


const survey_proc = {
    timeline: [
        survey_trial
    ],
    conditional_function: function() {
        return survey_config.run
    }
};


mainTimeline.push(survey_proc);