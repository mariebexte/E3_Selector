//Grid: sizes
var numberW = 8;
var numberPerSide = 7;
var sizeW = 22;
var size = 12;
var pixelsW =700;
var pixelsPerSide = 350;

//Grid: colors
var colorText = "black";
var colorAvailable = "green";
var colorUnavailable = "#D5DBDB";
var noColor = "none";

//Grid: axes
var times_userNotAvailable = loadDeselectedTimeslots();
var init = false;
if(times_userNotAvailable == null){
    times_userNotAvailable = [];
    init = true;
}
var times_display = ["8 - 10", "10 - 12", "12 - 14", "14 - 16", "16 - 18", "18 - 20"];
var times = ["8-10", "10-12", "12-14", "14-16", "16-18", "18-20"];
var days_display = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

var svg = d3.select("#availability").append("svg")
    .attr("width", pixelsW)
    .attr("height", pixelsPerSide)
    .attr("viewBox", [0, 0, numberW * sizeW + numberW, numberPerSide * size + numberPerSide].join(" "));

//Draw grid
for (var i = 0; i < numberW; i++) {
    for (var j = 0; j < numberPerSide; j++) {

        var g = svg.append("g").attr("transform", ["translate(", i * sizeW + i, ",", j * size + j, ")"].join(""));
        var number = numberPerSide * i + j;
        var box = g.append("rect")
            .attr("width", sizeW)
            .attr("height", size);

        if (i == 0 || j == 0) {
            box.attr("fill", noColor);

            //Time nodes
            if (i == 0 && j > 0) {
                box.attr("fill", noColor);

                var text = g.append("text")
                    .text(times_display[j - 1])
                    .attr("fill", colorText)
                    .attr("font-size", 4)
                    .attr("x", size/ 1.5)
                    .attr("y", size / 1.7);

            }

            //Day nodes
            if (j == 0 && i > 0) {
                box.attr("fill", noColor);
                var text = g.append("text")
                    .text(days_display[i - 1])
                    .attr("fill", colorText)
                    .attr("font-size", 4)
                    .attr("x", size / 1.5)
                    .attr("y", sizeW / 2.5);
            }
        }
        //Clickable timetable cells
        else {
            if(init){
                times_userNotAvailable.push("" + days[i - 1] + times[j - 1]);
            }
            box.attr("fill", colorUnavailable)
                .attr("id", days[i - 1] + times[j - 1])
                .on("click",function(d){
                    if(times_userNotAvailable.includes(this.id)){
                        d3.select(this).attr("fill",colorAvailable);
                        var index = times_userNotAvailable.indexOf(this.id);
                        times_userNotAvailable.splice(index,1);
                    }
                    else{
                        d3.select(this).attr("fill",colorUnavailable);
                        times_userNotAvailable.push(this.id);
                    }
                });
        }
    }
}

//Reinstate selections if user has already entered information and is returning to this page
var selectedStudyProgram = loadSelectedStudyProgram();
if(selectedStudyProgram != null){
    d3.select("#studyProgram").property("value",selectedStudyProgram);
}

var deselectedLanguages = loadDeselectedLanguages();
if(deselectedLanguages != null){
    d3.selectAll('input').property('checked', function(d){
        if(deselectedLanguages.includes(d3.select(this).attr("value"))){
            return false;
        }
        else{
            return true;
        }
    });
}

var deselectedTimeslots = loadDeselectedTimeslots();
if(deselectedTimeslots != null){
    d3.selectAll("rect").each(function (d) {
        if(d3.select(this).attr("id") != null){
            if(!deselectedTimeslots.includes(d3.select(this).attr("id"))){
                d3.select(this).attr("fill",colorAvailable);
            }
        }
    });
}

//Moving to next page
var showPage2Button = d3.select('#showNextPage');
showPage2Button.on('click', filterAccordingToHardConstraints);

//Apply selection of the user to the full set of courses
function filterAccordingToHardConstraints() {

    d3.json('../e3_courses.json').then(function (data) {

        //Count how many courses remain after filtering
        var sumOfCourses = 0;
        var deleteCourse;
        var subtree;
        var course;

        //Get user selections
        var studyProgram = d3.select("#studyProgram").node().value;
        setSelectedStudyProgram(studyProgram);

        var deselectedLanguages = [];
        var inputElements = document.getElementsByClassName('languageSelection');
        for (var k = 0; k < inputElements.length; ++k) {
            if (!inputElements[k].checked) {
                deselectedLanguages.push(inputElements[k].value);
            }
        }
        setDeselectedLanguages(deselectedLanguages);

        //Remove all courses not matching selections; iterate through level 2 nodes
        for (i = 0; i < data.children.length; i++) {

            subtree = data.children[i].children;
            deleteCourse = false;

            for (k = subtree.length - 1; k >= 0; k--) {

                course = subtree[k];
                deleteCourse = false;

                for (j = 0; j < deselectedLanguages.length; j++) {
                    if (course.Language.includes(deselectedLanguages[j])) {
                        deleteCourse = true;
                    }
                    if (course.Ausgeschlossen_Ingenieurwissenschaften_Bachelor.includes(studyProgram)) {
                        deleteCourse = true;
                    }
                    for (timestamp of times_userNotAvailable) {
                        if (course.Times_manual.includes(timestamp)) {
                            deleteCourse = true;
                        }
                    }
                }
                if (deleteCourse) {
                    data.children[i].children.splice(data.children[i].children.indexOf(course), 1);
                }
            }
            sumOfCourses = sumOfCourses + data.children[i].children.length;
        }

        if (sumOfCourses > 0) {
            //Save deseletcted timeslots for reuse on final page
            setDeselectedTimeslots(times_userNotAvailable);

            //Save filtered data to draw tree on next page
            setFilteredCourses(data);

            window.location.href='../2-course-tree-page/course-tree-page.html'
        }
        //Do not proceed if all courses are filtered out
        else {
            alert("Your selected options leave no courses to display!");
        }
    });
}