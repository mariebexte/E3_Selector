# E3 Selector
This project was developed as part of the Learning Analytics and Visual Analtics (LAVA) lab at the University of Duisburg-Essen (Prof. Dr. Mohamed Amine Chatti, Dr. Arham Muslim).

It presents a solution for a more easy selection of E3 courses, which are a special course catalog of the University of Duisburg-Essen from which every Bachelor student has to complete some. Before this project these courses could only be viewed as a list and it was not possible to filter them. This shall be fixed by offering the application developed here. It aims to  improve the course selection by including three steps:
* First, the user has to provide some basic information, which allows for all courses irrelevant to him/her to be filered out.
* Second, the user can browse the remaining courses, filter and select those that seem interesting.
* Third, a concise table view of the selected courses is combined with a visual representation of the student's timetable as wells as a radar chart displaying course ratings.
Screenshots of the visualizations are provided [below](#visualizations).
As of now, the application only includes Bachelor programs of the Faculty of Engineering.

## Data Collection
The course data used within this project was crawled from https://campus.uni-due.de/lsf using a [maven project](/course-crawling) included in this repository. It uses [JSoup]() version to crawl the data. The code also includes code to process the .csv-file resulting from the crawling process into a JSON file, which is simplified by including Apache Commons. The resulting course data was combined with course ratings manually collected from https://www.meinprof.de.

## Libraries
The project uses html, JavaScript and CSS and makes use of the following libraries:
* [Bootstrap](https://getbootstrap.com) v4.4.1
* [D3](https://d3js.org) v5.9.2
A downloaded version of all required libraries is included in the project.

## Project Architecture
    .
    ├── Application                       # E3 Selector aplication
        ├── 0-landing-page                  # .html and .css file for landing page
          └── ...
        ├── 1-personal-information-page     # .html, .css and .css file for personal information page
          └── ...
        ├── 2-course-tree-page              # .html, .css, and .js file for course tree page
          └── ...
        ├── 3-selection-page                # .html, .css, and .js file for selection page
          └── ...
        ├── scripts                         # Scripts used by all pages
          └── ...           
        ├── E3_icon.ico                     # Icon to be displayed in browser tab
        ├── Logo.png                        # Logo for navbar
        ├── E3_courses.json                 # Course data
    ├── course-crawling                   # Maven project used to crawl course data
        ├── ...                             # Java classes for crawling
        └── pom.xml                         # Handling project dependencies
    ├── images                            # Images included in this readme
        └── ...
    ├── README.md                         # What you are reading right now
    └── index.html                        # For deployment to github pages


The image below illustrates the project architecture. The application consists of four pages, with the horizontal arrows indicating the navigation path between these. A navigation bar allows navigation deviating from this expected path, as data consistency is ensured by including a local storage. This holds the information input into the personal information page and the output of the personal information page, which a filtered set of course data. The course tree and selection pages access this set of relevant courses. Below the line of the boxes repesenting the pages is a list of the main visualization elements present in the respective page.

![Project Architecture](/images/project-architecture.png)

## Visualizations & how to use the application
1. A brief assessment of basic information regarding the user, according to which the full course set will be filtered.
The user selects study program, which languages he or she is comfortable with and when they are available.
Availabilities are input using the visual timetable representation: clicking a cell means that they are available during the respecive timeslot.
![Information Page](/images/personal-information-page.png)
2. A tree layout allowing the user to filter through courses relevant to him or her. Only courses that fit the data collected in the previous page are included: they are open to the respective study program, take place in one of the selected languages and at a time where the user said he or she was available.
Filtering options on the left allow for easier browsing of the courses. A course can be selected by clicking on its title and will then be visible in the panel of selected courses.
![Tree Page](/images/course-tree-page.png)
3. A table layout concisely displays the courses selected by the user. It is enriched with rating information representing the popularity of a course, if available. The user can interact with this table by hovering over a row, which will cause the detailed ratings of the respective course to be overlayed over the average ratings in the radar chart. It will also highlight the corresponding timetable cells. The timetable includes a repetition of the times the user said he or she was available to visually communicate that the user will be free when the couse takes place.
![Selection Page](/images/selection-page.png)

## How to run the project
After cloning this repository, the project can be run locally. This requires starting starting a local server, e.g. using the [npm/Node.js](https://www.npmjs.com/get-npm) [http-server package](https://www.npmjs.com/package/http-server). Running *http-server* in the project folder should start the project at http://localhost:8080.

## Deployed Version
The master branch was deployed to https://mariebexte.github.io/E3_Selector/ using [GitHub Pages](https://pages.github.com/).

## Contributors
* Marie Bexte
* Aynaz Khoshkoo
* Yuewei Ma
