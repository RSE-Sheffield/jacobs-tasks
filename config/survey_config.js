var survey_config = {
    run: true
}

const survey_json = {
    pages: [
        {
            name: "page_1",
            title: "Your Name",
            elements: [
                {type: "text", name: "first_name", title: "Enter your first name:"},
                {type: "text", name: "last_name", title: "Enter your last name:"},
            ]
        },
        {
            name: "page_2",
            title: "Personal Information",
            elements: [
                {type: "text", name: "location", title: "Where do you live?"},
                {type: "text", name: "occupation", title: "What is your occupation?"},
                {type: "text", name: "age", title: "How old are you?", inputType: "number", min: 0, max: 120}
            ]
        }]
  };