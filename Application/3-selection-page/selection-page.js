//Load data and convert it to a set of nodes consistent with tree structure of previous page; to ensure consistency
var filteredData = loadFilteredCourses();
if(filteredData == null){
    alert("Please enter your information first.");
    window.location.href='../1-personal-information-page/personal-information-page.html';
}
    var root = d3.hierarchy(filteredData, function (d) { return d.children; });
    var treemap = d3.tree().size([100, 100]);
    var treeData = treemap(root);
    var nodes = treeData.descendants();
if(nodes.filter(function(d){return d.data.selected == true}).length < 1){
    alert("Please select some courses first!");
    window.location.href='../2-course-tree-page/course-tree-page.html';
}

//GRID
var colorText = "black";
var colorAvailable = "green";
var colorUnavailable = "#D5DBDB";
var noColor = "none";

var highlightColor = '#FBC9B6';
var selectedCourseColor = '#E79274';

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
var times_display = ["8 - 10", "10 - 12", "12 - 14", "14 - 16", "16 - 18", "18 - 20"];
var times = ["8-10", "10-12", "12-14", "14-16", "16-18", "18-20"];
var days_display = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

var svg = d3.select("#timeTable").append("svg")
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
        //Set fill color
        else {
            box.attr("id", days[i - 1] + times[j - 1])
                .attr("fill",function(d){
                    if(times_userNotAvailable.includes(this.id)){
                        return colorUnavailable;
                    }
                    else{
                        return colorAvailable;
                    }
                });
        }
    }
}

//TABLE
var titles = ["Delete", "Title", "Recommendation", "Credits", "Type", "Exam", "Location", "Language", "Link"];
var sortAscending = false;
var sorted_by;
var selected_row;

var colorAvailable = "green";
var colorUnavailable = "#D5DBDB";

var timeTable = d3.select('#timeTable');
var times = [];
var time;
var courseTimes;

//Define basic table structure: headers
var table = d3.select('#selectedCoursesTable')
    .append('table');

var headers = table.append('thead')
    .append('tr')
    .selectAll('th')
    .data(titles)
    .enter()
    .append('th')
    .attr('id',function(d){return d+'_title';})
    .text(function (d) {
        return d;
    });

var rows = table.append('tbody');

//Can sort by any column except delete and link
headers.append('p')
    .attr('class','sort-marker');
d3.select('#Delete_title').selectAll('.sort-marker').remove();
d3.select('#Link_title').selectAll('.sort-marker').remove();

//Sorting functionality
headers.on('click', function (d) {
    //Do nothing if delete or link column is clicked
    if(this.id.localeCompare('Delete_title')==0 || this.id.localeCompare('Link_title')==0){
        return null;

    //Recommendation column needs own comparator
    }else if(this.id.localeCompare('Recommendation_title')==0){

        sorted_by = this.id;
        var table_rows = rows.selectAll('.table-data');

        if (sortAscending) {
            table_rows.sort(
                function(a, b) {
                    var first = a.data[d];
                    var second = b.data[d];

                    if(first != ''){
                        first = parseInt(first);
                    }
                    else{
                        first = -1;
                    }if(second != ''){
                        second = parseInt(second);
                    }
                    else{
                        second = -1;
                    }
                    return d3.ascending(first,second);
                 });
            sortAscending = false;
            headers.selectAll('p.sort-marker').text('');
            d3.select(this).select('.sort-marker')
                .text('▲');

        } else {
            table_rows.sort(
                function(a, b) {
                    var first = a.data[d];
                    var second = b.data[d];

                    if(first != ''){
                        first = parseInt(first);
                    }else{
                        first = -1;
                    }
                    if(second != ''){
                        second = parseInt(second);
                    }else{
                        second = -1;
                    }
                    return d3.descending(first,second);
                });
                sortAscending = true;
                headers.selectAll('p.sort-marker').text('');
                d3.select(this).select('.sort-marker')
                    .text('▼');
        }

    //All other rows can be sorted using built in functions
    }else{
        
        sorted_by = this.id;
        var table_rows = rows.selectAll('.table-data')

        if (sortAscending) {
            table_rows.sort(
                function(a, b) {
                    return d3.ascending(a.data[d], b.data[d]);
                });
                sortAscending = false;
                headers.selectAll('p.sort-marker').text('');
                d3.select(this).selectAll('.sort-marker')
                    .text('▲');
        } else {
            table_rows.sort(
                function(a, b) {
                    return d3.descending(a.data[d], b.data[d]);
                });
                sortAscending = true;
                headers.selectAll('p.sort-marker').text('');
                d3.select(this).selectAll('.sort-marker')
                    .text('▼');
        }

    }});


    //Fill table with selected courses
    function fillSelectedCoursesTable() {
        rows.selectAll('.table-data').remove();
        rows.selectAll('tr')
            .data(nodes.filter(function (d){
                    return d.data.selected == true;

            })).enter()
            .append('tr')
            .attr('class', 'table-data')
            .selectAll('td')
            .data(function (d) {
                return titles.map(function (k) {
                    return { 'value': d.data[k], 'name': k };
                });
            }).enter()
            .append('td')
            .attr('data-th', function (d) {
                return d.name;
            })
            .attr('class', function (d) {
                return d.name;
            })
            .text(function (d) {
                if (!(d.name == "Link") && !(d.name == "Delete")) {
                    return d.value;
                }
            });

        //Insert links into respective column
        rows.selectAll('.Link').append('a')
            .attr('href', function (d) {
                return d.value;
            })
            .attr('target', '_blank')
            .attr('class', 'fakeButton')
            .text("LSF");

        //Draw bars indicating recommendation percentage
        rows.selectAll('.table-data').selectAll('.Recommendation').attr('style','font-size:0pt;');
        rows.selectAll('.table-data').selectAll('.Recommendation')
            .append('svg')
            .attr('height', '30px')
            .attr('width', function (d) {
                return "100%";
            })
            .append('rect')
            .attr('fill', 'palegreen')
            .attr('height', '30px')
            .attr('width', function (d) {
                if (d.value > 0){
                    return d.value + "%";
                }
            })
            .each(function (d) {
                d3.select(this.parentNode).append('text')
                    .text(function (d) {
                        if (d.value > 0){
                            return d.value + "%";
                        }
                        else{
                            return "No data available";
                        }
                    })
                    .attr('x', '5%')
                    .attr('y', '70%')
                    .attr('style','font-size:10pt;');
            });

        // Make cells deletable
        d3.selectAll('tr').each(function (d) {
            d3.select(this).selectAll('.Delete').each(function () {
                d3.select(this)
                    .append('svg')
                    .attr('height', '30px')
                    .attr('width', '50px')
                    .append('circle')
                    .attr('r', 14)
                    .attr("cx", '50%')
                    .attr('cy', '50%')
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .each(function () {
                        d3.select(this.parentNode)
                            .append('text')
                            .on('click', function () {
                                d.data.selected = false;
                                setFilteredCourses(filteredData);
                                d3.select(this.parentNode.parentNode.parentNode).each(
                                    function (d) {
                                        //Reset possible marks in course table and timetable
                                        d3.select(this)
                                            .attr('style', 'background-color:white;');
                                        times = [];
                                        courseTimes = d.data.Times_manual;
                                        if (!courseTimes == "") {
                                            if (courseTimes.includes(';')) {
                                                var times = courseTimes.split(';');
                                            }
                                            else {
                                                times.push(courseTimes);
                                            }

                                            for (t = 0; t < times.length; t++) {
                                                time = times[t];
                                                var name = '#' + time;
                                                timeTable.select(name)
                                                    .attr('fill', function () {
                                                        if(times_userNotAvailable.includes(time)){
                                                            return colorUnavailable;
                                                        }
                                                        else{
                                                            return colorAvailable;
                                                        }
                                                    });
                                            }
                                        }

                                        if (d3.select(this).select('.Title').attr('style') != null && d3.select(this).select('.Title').attr('style').includes('background-color:'+selectedCourseColor)) {

                                            d3.select(this).select('.Title')
                                                .attr('style', 'background-color:none');
                                            times = [];
                                            courseTimes = d.data.Times_manual;
                                            if (!courseTimes == "") {
                                                if (courseTimes.includes(';')) {
                                                    times = courseTimes.split(';');
                                                }
                                                else {
                                                    times.push(courseTimes);
                                                }
                                                for (t = 0; t < times.length; t++) {
                                                    time = times[t];
                                                    var name = '#' + time;
                                                    timeTable.select(name).each(function () {
                                                        d3.select(this.parentNode)
                                                            .selectAll('.courseMarker').remove();
                                                    })
                                                }
                                            }
                                        }

                                    });

                                    //Refill course table
                                    fillSelectedCoursesTable();

                                    //Recreate status before refilling table: sort and select
                                    sortAscending = !sortAscending;
                                    document.getElementById(sorted_by).click();
                                    if(selected_row != null){
                                        d3.selectAll('tr.table-data').each(function(d){
                                            if(d == selected_row){
                                                d3.select(this).selectAll('.Title')                         
                                                    .attr('style', 'background-color:'+selectedCourseColor);
                                            }
                                        });                                   
                                    }

                                })
                                //Styling of delete buttons
                                .attr("style", "font-size:17pt;")
                                .attr("x", "50%")
                                .attr("y", "55%")
                                .attr("dominant-baseline", "middle")
                                .attr("text-anchor", "middle")
                                .text('×')
                                .attr('cursor','pointer');
                    });
            });
        });

        //Hovering functionality
        //Enable selection of courses
        d3.selectAll('.table-data').selectAll('.Title')
            .on('click', function () {
                //Check if course is currently selected
                if (d3.select(this).attr('style') != null && d3.select(this).attr('style').includes('background-color:'+selectedCourseColor)) {

                    selected_row = null;

                    d3.select(this)
                        .attr('style', 'background-color:none');

                    d3.select(this.parentNode).each(function(d){

                        times = [];
                        courseTimes = d.data.Times_manual;
                        if (!courseTimes == "") {
                            if (courseTimes.includes(';')) {
                                times = courseTimes.split(';');
                            }
                            else {
                                times.push(courseTimes);
                            }
                            for (t = 0; t < times.length; t++) {
                                time = times[t];
                                var name = '#' + time;
                                timeTable.select(name).each(function () {
                                    d3.select(this.parentNode)
                                        .selectAll('.courseMarker').remove();
                                })
                            }
                        }
                    });

                }else {

                    //Reset selection
                    timeTable.selectAll('.courseMarker').remove();
                    table.selectAll('.Title')
                        .attr('style', 'background-color:none');

                    d3.select(this)
                        .attr('style', 'background-color:'+selectedCourseColor);

                    d3.select(this.parentNode).each(function(d){

                        selected_row = d;

                        times = [];
                        courseTimes = d.data.Times_manual;

                        if (!courseTimes == "") {
                            if (courseTimes.includes(';')) {
                                times = courseTimes.split(';');
                            }
                            else {
                                times.push(courseTimes);
                            }
                            for (t = 0; t < times.length; t++) {
                                time = times[t];
                                var name = '#' + time;
                                timeTable.select(name).each(function () {
                                    d3.select(this.parentNode)
                                        .append('g')
                                        .append('circle')
                                        .attr('r', 5)
                                        .attr('cx', '11px')
                                        .attr('cy', '6px')
                                        .attr('class', 'courseMarker')
                                        .attr('fill', selectedCourseColor);
                                })
                            }
                        }
                    });
                }
        });

//RADAR CHART--------------------------------------------------------------

//RadarChart properties
var average_ratings = [
    {
        name: 'Average Rating',
        axes: [
            { axis: 'interesting', value: 3.82 },
            { axis: 'support', value: 3.91 },
            { axis: 'material', value: 3.77 },
            { axis: 'comprehensible', value: 4.02 },
            { axis: 'fun', value: 3.67 },
            { axis: 'fair', value: 4.05 },
            { axis: 'grade/effort', value: 4.07 }
        ]
        ,
        color: '#26AF32'
    }
];

var radarMargin = { top: 65, right: 80, bottom: 50, left: 300 },
    width = Math.min(700, window.innerWidth / 4) - 30 - 10,
    height = Math.min(width, window.innerHeight - 20 - 10);

var radarChartOptions = {
    w: 600,
    h: 200,
    margin: radarMargin,
    levels: 5,
    maxValue: 5,
    legend: { title: '', translateX: -50, translateY: 100 },
    roundStrokes: false,
    color: d3.scaleOrdinal().range(["#6EA2A5", "FAB094"]),
    format: '.0f'
};

var svg_radar1 = RadarChart("#radarChart", average_ratings, radarChartOptions);

var fair;
var support;
var material;
var comprehensible;
var fun;
var interesting;
var grade_effort;

var hasRatings;
        
//On mouseenter of a row: visually display course hours in timetable & average ratings in radar chart
d3.selectAll('.table-data')
    .on('mouseenter', function (d) {
        d3.select(this)
            .attr('style', 'background-color:'+highlightColor+';');

        times = [];
        courseTimes = d.data.Times_manual;
        if (!courseTimes == "") {
            if (courseTimes.includes(';')) {
                times = courseTimes.split(';');
            }else {
                times.push(courseTimes);
            }
            for (t = 0; t < times.length; t++) {
                time = times[t];
                var name = '#' + time;
                timeTable.select(name)
                    .attr('fill', highlightColor);
            }
        }

        //Display course ratings in radar chart
        //if it has ratings: show them, else show that there aren't any
        fair = d.data.fairness;
        support = d.data.support;
        material = d.data.material;
        comprehensible = d.data.comprehensibility;
        fun = d.data.fun;
        interesting = d.data.interesting;
        grade_effort = d.data.grade_effort;

        hasRatings = false;
        if ((!fair == '') && (!support == '') && (!material == '') && (!comprehensible == '') && (!fun == '') && (!interesting == '') && (!grade_effort == '')) {
            hasRatings = true;
        }

        if (!hasRatings) {
            fair = 0;
            support = 0;
            material = 0;
            comprehensible = 0;
            fun = 0;
            interesting = 0;
            grade_effort = 0;
        }

        var ratings_withSelectedCourse = [
            {name: 'Average Rating',
                axes: [
                    { axis: 'interesting', value: 3.82 },
                    { axis: 'support', value: 3.91 },
                    { axis: 'material', value: 3.77 },  
                    { axis: 'comprehensible', value: 4.02 },  
                    { axis: 'fun', value: 3.67 },                                        
                    { axis: 'fair', value: 4.05 },
                    { axis: 'grade/effort', value: 4.07 }],
                    color: '#26AF32'
            },
            {name: d.data.Title,
                axes: [
                    { axis: 'fair', value: fair },
                    { axis: 'support', value: support },
                    { axis: 'material', value: material },
                    { axis: 'comprehensible', value: comprehensible },
                    { axis: 'fun', value: fun },
                    { axis: 'interesting', value: interesting },
                    { axis: 'grade/effort', value: grade_effort }],
                    color: 'blue'
            }
        ];

        //Show average and ratings for hovered course
        svg_radar1 = RadarChart("#radarChart", ratings_withSelectedCourse, radarChartOptions);

        //Display that there are no ratings
        if (!hasRatings) {
            var noRatings = svg_radar1.append('g')

            noRatings.append('circle')
                .attr('transform', 'translate(300,165)')
                .attr('fill', highlightColor)
                .attr('r', 50);

            noRatings.append('text')
                .attr('x', '33.5%')
                .attr('y', '53%')
                .attr("text-anchor", "middle")
                .text('NO RATINGS');

            noRatings.append('text')
                .attr('x', '33.5%')
                .attr('y', '58%')
                .attr("text-anchor", "middle")
                .text('AVAILABLE');
        }

});

//On mouseleave of table row: reset        
d3.selectAll('.table-data')
    .on('mouseleave', function (d) {
        d3.select(this)
            .attr('style', 'background-color:white;');

        times = [];
        courseTimes = d.data.Times_manual;
        if (!courseTimes == "") {
            if (courseTimes.includes(';')) {
                var times = courseTimes.split(';');
            }else {
                times.push(courseTimes);
            }

            for (t = 0; t < times.length; t++) {
                time = times[t];
                var name = '#' + time;
                timeTable.select(name)
                    .attr('fill', function () {
                        if(times_userNotAvailable.includes(time)){
                            return colorUnavailable;
                        }else{
                            return colorAvailable;
                        }
                    });
            }
        }

        //Reset radar chart to only show average ratings
        svg_radar1 = RadarChart("#radarChart", average_ratings, radarChartOptions);

        });
}

//Table is initially sorted by recommendation
fillSelectedCoursesTable();
document.getElementById('Recommendation_title').click();