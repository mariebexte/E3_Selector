//SLIDER to filter for credit span
var sliderRange = d3
.sliderBottom()
.min(1)
.max(9)
.step(1)
.width(150)
.ticks(10)
.default([1, 9])
.fill('darkslategray')
.on('onchange', val => {
    credit_range = val;
    update(root,true);
});

var gRange = d3
.select('div#slider-range')
.append('svg')
.attr('width', 500)
.attr('height', 80)
.append('g')
.attr('transform', 'translate(12,20)');

gRange.call(sliderRange);


//TREE-------------------------------------------------------------------
//Hue encoding of course types
var seminarColor = "peachpuff";
var blockSeminarColor = "salmon";
var lectureColor = "powderblue";
var lectureExerciseColor = "lightgreen";
var eLearningColor = "thistle";

var seminarColorDark = "orange";
var blockSeminarColorDark = "red";
var lectureColorDark = "dodgerblue";
var lectureExerciseColorDark = "limegreen";
var eLearningColorDark = "darkorchid";

//Check all filtering options in the beginning
d3.select('#page2').selectAll('input').attr('checked', 'true');
// Add filtering to checkboxes
d3.select('#page2').selectAll('input').on('click', function(){update(root,true);});

var selectionPanel = d3.select("#selectedCoursesPanel");

//Load data used to draw tree, already filtered according to constraints set on page1
var filteredData = loadFilteredCourses();
if(filteredData == null){
    alert("Please enter your information first.");
    window.location.href='../1-personal-information-page/personal-information-page.html';
}
var catalogNames = ["BNE", "IOS", "Kultur und Gesellschaft", "Natur und Technik", "Wirtschaft"];
var credit_range = ["1", "9"];

//Node indexes
var i = 0;

//Diagram measurements
var margin = { top: 20, right: 10, bottom: 10, left: 30},
    width = 900 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

//Tree layout
var treemap = d3.tree().size([height, width]);
var svg = d3.select("#treeSVG")
    .attr("class", "mainElement")
    .attr("viewBox", "0 0 1030 900")
    .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)}))
    .append("g")
    .attr('transform',"translate(20,20)");

//Set of nodes used to populate panel of selected courses
var root_filter = d3.hierarchy(filteredData, function (d) { return d.children; });
var treeData_filter = treemap(root_filter);
var nodes_filter = treeData_filter.descendants();

//Data used to draw the tree
var root = d3.hierarchy(filteredData, function (d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

//Collapse after the second level
root.children.forEach(collapse);
//Expand first catalog
root.children[0].children = root.children[0]._children;
root.children[0]._children = null;
//Collapse node and all children
function collapse(d) {
    if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

update(root, false);
updateSelectedCourses();

function update(source, filtering) {
    
    //When user is just filtering do not animate tree changes
    var duration;
    if (filtering) {
        duration = 0;
    }
    else {
        duration = 750;
    }

    //Assign the x and y position of nodes
    var treeData = treemap(root);

    //Compute new tree layout
    var nodes = treeData.descendants();
    var links = treeData.descendants().slice(1);

    //Fixed depth
    nodes.forEach(function (d) { d.y = d.depth * 180 });

    // ****************** Nodes section ***************************

    var node = svg.selectAll('g.node')
        .data(nodes.filter(function(d){
                return filter_checkboxes(d);
            }), function(d) {
                    return d.id || (d.id = ++i); }
        );  

    // Enter new nodes at the parents previous position
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function (d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // Add circles for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6);

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr('class', 'node')
        .attr("dy", ".35em")
        .attr("x", function (d) {
            //Node labels for empty catalog nodes (2nd level) should appear left
            if (!d.children && !d._children) {
                if (catalogNames.includes(d.data.Title)) {
                    return -13;
                }
            }
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function (d) {
            //Node labels for empty catalog nodes should appear left
            if (!d.children && !d._children) {
                if (catalogNames.includes(d.data.Title)) {
                    return "end";
                }
            }
            return d.children || d._children ? "end" : "start";
        })
        .text(function (d) { return d.data.Title; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to proper position for node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 9)
        .style('fill', function (d) {
            //Node is not expanded
            if(d.children){
                console.log('TITLE '+Object.getOwnPropertyNames(d.children));
            }
        
            if (d._children) {
                if (d._children.length > 0) {
                    return "black";
                }
            }
            else {
                switch (d.data.Type) {
                    case "Seminar": return seminarColor;
                    case "Blockseminar": return blockSeminarColor;
                    case "Vorlesung": return lectureColor;
                    case "VL/Übung": return lectureExerciseColor;
                    case "E-Learning": return eLearningColor;
                    default: return "white";
                }
            }
        })
        .style('stroke', function (d) {
            switch (d.data.Type) {
                case "Seminar": return seminarColorDark;
                case "Blockseminar": return blockSeminarColorDark;
                case "Vorlesung": return lectureColorDark;
                case "VL/Übung": return lectureExerciseColorDark;
                case "E-Learning": return eLearningColorDark;
                default: return "black";
            }
        })
        .attr('cursor', 'pointer');

    //Update node labels
    nodeUpdate.select('text')
        .style('fill', function (d) {
            if(d.data.selected == true){
                switch (d.data.Type) {
                    case "Seminar": return seminarColorDark;
                    case "Blockseminar": return blockSeminarColorDark;
                    case "Vorlesung": return lectureColorDark;
                    case "VL/Übung": return lectureExerciseColorDark;
                    case "E-Learning": return eLearningColorDark;
                    default: return "black";
                }
            }
            return "black";
        })
        .attr('cursor', 'pointer');

    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce node circle size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update links
    var link = svg.selectAll('path.link')
        .data(links.filter(function(d){
            return filter_checkboxes(d);
        }), function (d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function (d) {
            var o = { x: source.x0, y: source.y0 }
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) { return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
            var o = { x: source.x, y: source.y }
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
        path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
        ${(s.y + d.y) / 2} ${d.x},
        ${d.y} ${d.x}`
        return path
    }

    // Toggle children on click.
    function click(d) {
        //Treat leaves differently: these are selectable courses
        if (!d.children && !d._children) {
            if (catalogNames.includes(d.data.Title)) {
                //Empty catalog: should be a non-responsive node
            } else {
                var selected = d.data.selected;
                d.data.selected = !selected;
            }
            setFilteredCourses(filteredData);
            updateSelectedCourses();
        }
        else {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                root.children.forEach(collapse);
                d.children = d._children;
                d._children = null;
            }
            update(d, false);
        }
    }
}

//Apply selected filtering options to node that is passed as argument
function filter_checkboxes(d){
    var checkboxes = d3.select('#page2').selectAll("input[type='checkbox']:not(:checked)");  

    if(d.data.Title == " " || catalogNames.includes(d.data.Title))
        {
            //These should never be filtered out
            return true;
        }

    keepCourse = true;
    checkboxes.each(
        function(){

            key = this.name;
            value = this.value;

            //Relaxed condition to also match fields with multiple entries
            if(d.data[key].includes(value) || d.data[key] == "unknown"){
                keepCourse = false;
            }

        });

        //See if course falls within selected range of credits
        minCred = credit_range[0];
        maxCred = credit_range[1];
        courseCred = d.data["Credits"];
        if(courseCred.includes('-')){
            courseCredArr = courseCred.split("-");
            courseMin = courseCredArr[0];
            courseMax = courseCredArr[1];
        }
        else{
            courseMin = courseCred;
            courseMax = courseCred;
        }

        if(courseMax < minCred){
            keepCourse = false;
        }
        if(maxCred < courseMin){
            keepCourse = false;
        }

        return keepCourse;
}

function updateSelectedCourses() {
    //Update node labels according to selection: highlight title if selected
    d3.select('#treeSVG').selectAll('text')
        .style('fill', function (d) {
            if (d.data.selected == true) {
                switch (d.data.Type) {
                    case "Seminar": return seminarColorDark;
                    case "Blockseminar": return blockSeminarColorDark;
                    case "Vorlesung": return lectureColorDark;
                    case "VL/Übung": return lectureExerciseColorDark;
                    case "E-Learning": return eLearningColorDark;
                    default: return "black";
                }
            }
            return "black";
        });

    //Populate selected courses panel
    selectionPanel.selectAll("p").remove();
    selectionPanel.selectAll('p')
        .data(nodes_filter.filter(function(d){
            return d.data.selected == true;
        })).enter()
        .append('p')
        .attr('class', 'text')
        .on('click', function (d) {
            d.data.selected = false;
            setFilteredCourses(filteredData);
            updateSelectedCourses();})
        .text(function (d) {
            return d.data.Title;})
        .append("svg")
        .attr("style", "position:absolute;top:-4;right:-10")
        .attr("height", "24px")
        .attr("width", "24px")
        .append("circle")
        .attr("r", "10px")
        .attr("cx", "12px")
        .attr("cy", "12px")
        .attr("stroke", function (d) {
            switch (d.data.Type) {
                case "Seminar": return seminarColorDark;
                case "Blockseminar": return blockSeminarColorDark;
                case "Vorlesung": return lectureColorDark;
                case "VL/Übung": return lectureExerciseColorDark;
                case "E-Learning": return eLearningColorDark;
                default: return "black";}
            })
        .attr("fill", function (d) {
            switch (d.data.Type) {
                case "Seminar": return seminarColor;
                case "Blockseminar": return blockSeminarColor;
                case "Vorlesung": return lectureColor;
                case "VL/Übung": return lectureExerciseColor;
                case "E-Learning": return eLearningColor;
                default: return "black";}
        });

    //Draw x in delete circles
    selectionPanel.selectAll("p svg")
        .append("text")
        .attr("style", "font-size:17pt;")
        .attr("x", "52%")
        .attr("y", "55%")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .text("×")
        .attr('cursor', 'pointer');
}

//Button functionality
d3.select('#detailedViewButton').on('click', showDetailedView);

function showDetailedView() {
    if(nodes_filter.filter(function(d){
            return d.data.selected == true;
        }).length > 0
    ){
        window.location.href='../3-selection-page/selection-page.html';

    }
    else {
        alert('Please select some courses to compare!')
    }
}