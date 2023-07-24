var config = {
    "fixationDuration": 250,               // Fixation length in ms
    "stimulusDuration": 1500,              // stimulus duration in ms
    "blankDuration": 500,                  // duration in ms of blank screen between stim and response
    "nTrialReps": 10,                       // Number of trial repetitions (actual trial number = this * 2)
    "stimSize": 50,                         // Size of the stimulus in pixels
    "stimBord": 20,                         // Size of the border around the stimulus in pixels
    "colours": ["red", "blue", "yellow",    // Array of potential stimulus colours
                "green", "orange", "purple",
                "magenta", "cyan"],
    "startValue": 2,                        // Starting number od stimuli
    "minValue": 2,                          // Minimum number of stimuli
    "maxValue": 8,                         // Maximum number of stimuli
    "staircaseUp": 3,                       // Number of correct answers to move up the staircase
    "staircaseDown": 1                      // Number of incorrect answers to move down the staircase
}