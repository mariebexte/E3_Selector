# E3 Selector
This project was developed as part of the Learning Analytics and Visual Analytics (LAVA) lab at the University of Duisburg-Essen lead by Prof. Dr. Mohamed Amine Chatti and Dr. Arham Muslim.

It presents a solution for a more easy selection of E3 courses, which are a special course catalog of the University of Duisburg-Essen from which every Bachelor student has to complete some. Before this project these courses could only be viewed as a list and it was not possible to filter them. This shall be fixed by offering the application developed here. It aims to  improve course selection in three steps:
* First, the user has to provide some basic information, which allows for all courses irrelevant to him/her to be filtered out.
* Second, the user can browse the remaining courses, filter and select those that seem interesting.
* Third, a concise table view of the selected courses is combined with a visual representation of the student's timetable as wells as a radar chart displaying course ratings.

Screenshots of the visualizations are provided [below](#visualizations-and-how-to-use-the-application).
As of now, the application only includes Bachelor programs of the Faculty of Engineering.

## Data Collection
The course data used within this project was crawled from https://campus.uni-due.de/lsf using a [maven project](/course-crawling) included in this repository. It uses [jsoup](https://jsoup.org) (v1.12.1) to crawl the data. The project also includes code to process the .csv-file resulting from the crawling process into a JSON file, which is simplified by including [Apache Commons CSV](https://commons.apache.org/proper/commons-csv/) (v.1.7). The resulting course data was combined with course ratings manually collected from https://www.meinprof.de.

## Libraries
The application uses HTML, JavaScript and CSS and makes use of the following libraries:
* [Bootstrap](https://getbootstrap.com) (v4.4.1)
* [D3](https://d3js.org) (v5.9.2)

Some D3 elements were inspired by other projects:
* The tree layout used in the course-tree-page of this project was derived from [this](https://gist.github.com/d3noob/43a860bc0024792f8803bba8ca0d5ecd) project (released under the [MIT License](https://opensource.org/licenses/MIT))
* The filtering slider used in the course-tree-page is based on [this](https://gist.github.com/johnwalley/e1d256b81e51da68f7feb632a53c3518) project (released under [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause))
* The radar chart used in the selection-page is based on [this](https://gist.github.com/Kuerzibe/338052519b1d270b9cd003e0fbfb712e) project (released under the [MIT License](https://opensource.org/licenses/MIT))

A downloaded version of all required libraries is included in the project.

## Project Architecture
    .
    ├── Application                       # E3 Selector aplication
        ├── 0-landing-page                  # .html and .css file for landing page
          └── ...
        ├── 1-personal-information-page     # .html, .css and .js file for personal information page
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


The image below illustrates the architecture of the application. It consists of four pages, with the horizontal arrows indicating the navigation path between these. A navigation bar allows navigation deviating from this expected path, as data consistency is ensured by including a local storage. This local storage holds the information input into the personal information page as well as the output of the personal information page, which is a filtered set of course data. The course tree and selection pages access this set of relevant courses. The selection page additionaly requires the saved availabilities. The lists below the lines of the boxes repesenting the pages represent the main visualization elements present in the respective pages.

![Project Architecture](/images/project-architecture.png)

## Visualizations and How to Use the Application
1. **Assessing basic information**

Collection of some hard constraints regarding the user, according to which the full course set will be filtered.
The user selects study program, which languages he/she is comfortable with and when they are available.
Availabilities are input using a visual timetable representation: clicking a cell means that they are available during the respecive timeslot.
![Information Page](/images/personal-information-page.png)

2. **Browsing, filtering and selecting** 

A tree layout allows browsing through courses relevant to the user. Only courses that fit the data collected in the previous page are included: they are open to the respective study program, take place in one of the selected languages and at a time where the user said he/she was available. The left panel provides a set of filtering options. Courses can be selected by clicking on their title and will then be visible in the panel of selected courses on the right.
![Tree Page](/images/course-tree-page.png)

3. **Narrowing down the selection**

A table layout concisely displays the courses selected by the user. It is enriched with rating information representing the popularity of a course, if available. The user can interact with the table by hovering over a row, which will cause the detailed ratings of the respective course to be overlayed over the average ratings in the radar chart. Hovering will also highlight the corresponding timetable cells. The timetable includes a repetition of the times the user said he/she was available to visually communicate where the course would fit into the timetable and to confirm that they will be free when the couse takes place.
![Selection Page](/images/selection-page.png)

## How to run the project
After cloning this repository, the project can be run locally.
This requires starting a local server, e.g. using the [Node.js](https://www.npmjs.com/get-npm) [http-server package](https://www.npmjs.com/package/http-server).
Running *http-server* in the project folder should start the project at http://localhost:8080.

## Deployed Version
The master branch of this project was deployed to https://mariebexte.github.io/E3_Selector using [GitHub Pages](https://pages.github.com/).

## Contributors
* Marie Bexte
* Aynaz Khoshkoo
* Yuewei Ma
