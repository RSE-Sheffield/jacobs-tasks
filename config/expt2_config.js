var expt2_config = {
    run: true,
    practice: true,
    nImages: 414,              // Total number of images available
    nPracImages: 40,
    nPos: 8,
    radius: 250,
    radiusJitter: [0, 0],
    angleJitter: [0, 0],
    fixationDuration: 500,
    fixationPostTrial: 500,
    consolidationTime: [0, 2000],
    stimulusDims: [96, 96],
    nStimuli: [2, 6],
    timePerItem: [250, 500],
    novelProbe: [true, false],
    nTrialReps: 1,
    responseOptions: [
        "Yes - Sure",
        "Yes - Think",
        "Yes - Guess",
        "No - Guess", 
        "No - Think",
        "No - Sure",
    ],
    metaCapacity: false,
    metaOptions: ["number", "letter", "delay"],
    metaLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    metaDuration: 5000,
    feedback: false,
    showFeedbackOptions: [false, true],
    feedbackDuration: 1500,
    feedbackImgs: ['./img/feedbackPos.png', './img/feedbackNeg.png'],

    // Section for adaptive tasks
    adaptiveEncode: {
        use: true,
        regTime: 500,
        adaptTimes: {
            2: 700,
            3: 650,
            4: 600,
            5: 550,
            6: 500,
            7: 450,
            8: 400,
            9: 350,
            10: 300
        },
    },
    adaptiveConsol: {
        use: false,
        regTime: 3000, 
        adaptTimes: {
            2: 3000,
            3: 2750,
            4: 2500,
            5: 2250,
            6: 2000,
            7: 1750,
            8: 1500,
            9: 1250,
            10: 1000
        },
    },
    adaptLookBack: 5,
    // This bit is key, use as a placeholder for the timeline_variables
    // The use a function in the Expt objects to generate the appropriate
    // values
    adaptivePlaceholder: ["adapt", "reg"],
}