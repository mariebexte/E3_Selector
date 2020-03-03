let STUDYPROGRAM_KEY = "studyProgram";
let DESELECTED_LANGUAGES_KEY = "languages";
let DESELECTED_TIMESLOTS_KEY = "deselectedTimeslots";
let FILTERED_COURSES_KEY = "filteredCourses";
let SELECTED_COURSES_KEY = "selectedCourses";

/**
 * Retrieves selected study program
 * @returns {studyProgram}
 */
function loadSelectedStudyProgram() {
    return JSON.parse(localStorage.getItem(STUDYPROGRAM_KEY))
}

/**
 * Saves selected study program
 * @param studyprogram
 */
function setSelectedStudyProgram(studyprogram) {
    localStorage.setItem(STUDYPROGRAM_KEY, JSON.stringify(studyprogram));
}



/**
 * Retrieves languages the user did not select
 * @returns [selection]
 */
function loadDeselectedLanguages() {
    console.log("load deselected_languages");
    let selection = JSON.parse(localStorage.getItem(DESELECTED_LANGUAGES_KEY));
    console.log(selection);
    return selection;
}

/**
 * Saves list of deselected languages
 * @param list
 */
function setDeselectedLanguages(list) {
    let languages = [];
    for (let item of list) {
        languages.push(item)
    }
    console.log("set deselected languages")
    console.log(languages)
    localStorage.removeItem(DESELECTED_LANGUAGES_KEY);
    localStorage.setItem(DESELECTED_LANGUAGES_KEY, JSON.stringify(languages));
}




/**
 * Retrieves times that were not selected
 * @returns [selection]
 */
function loadDeselectedTimeslots() {
    console.log("load deselected timeslots");
    let selection = JSON.parse(localStorage.getItem(DESELECTED_TIMESLOTS_KEY));
    console.log(selection);
    return selection;
}

/**
 * Saves a set of deselected times
 * @param set
 */
function setDeselectedTimeslots(set) {
    let deselectedTimeslots = [];
    for (let item of set) {
        deselectedTimeslots.push(item)
    }
    console.log("set deselected timeslots")
    console.log(deselectedTimeslots)
    localStorage.removeItem(DESELECTED_TIMESLOTS_KEY);
    localStorage.setItem(DESELECTED_TIMESLOTS_KEY, JSON.stringify(deselectedTimeslots));
}




/**
 * Retrieves courses filtered according to hard constraints
 * @returns [selection]
 */
function loadFilteredCourses() {
    console.log("load filtered courses");
    let selection = JSON.parse(localStorage.getItem(FILTERED_COURSES_KEY));
    if (selection === null) {
        selection = []
    }
    console.log(selection);
    return selection;
}

/**
 * Saves courses filtered according to hard constraints
 * @param treeStructure
 */
function setFilteredCourses(treeStructure) {
    console.log("tree structure")
    console.log(treeStructure)
    localStorage.removeItem(FILTERED_COURSES_KEY);
    localStorage.setItem(FILTERED_COURSES_KEY, JSON.stringify(treeStructure));
}




/**
 * Retrieves list of selected courses
 * @returns [selection]
 */
function loadSelectedCourses() {
    console.log("selected course set")
    let selection = JSON.parse(localStorage.getItem(SELECTED_COURSES_KEY));
    if (selection === null) {
        selection = []
    }
    console.log(selection);
    return selection;
}

/**
 * Saves a list of selected courses
 * @param courses
 */
function setSelectedCourses(courses) {
    console.log("set selected courses");
    console.log(courses);
    localStorage.removeItem(SELECTED_COURSES_KEY);
    localStorage.setItem(SELECTED_COURSES_KEY, JSON.stringify(courses));
}



//Clear
//----------------------------

//Clears languages
function clearDeselectedLanguages() {
    localStorage.setItem(DESELECTED_LANGUAGES_KEY,"[]");
}

//Clears timeslots
function clearDeselectedTimeslots() {
    localStorage.setItem(DESELECTED_TIMESLOTS_KEY,"[]");
}

// Clears study program
function clearSelectedStudyprogram() {
    localStorage.setItem(STUDYPROGRAM_RETRIEVAL_KEY,"");
}

function clearAll() {
    clearDeselectedLanguages();
    clearSelectedStudyprogram();
    clearDeselectedTimeslots();
}