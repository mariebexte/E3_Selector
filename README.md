This project was developed by Marie Bexte, Aynaz Khoshkoo and Yuewei Ma as part of the Learning Analytics and Visual Analtics (LAVA) lab at the University of Duisburg-Essen (Prof. Dr. Mohamed Amine Chatti, Dr. Arham Muslim).

It presents a solution for a more easy selection of E3 courses, which are a special course catalog of the University of Duisburg-Essen from which every Bachelor student has to complete some courses. Before this project these courses could only be viewed as a list, but is was not possible to filter them. This shall be fixed by offering the application developed here. It consists of three pages:

* An entry page briefly describing to the user what steps are about to follow:
![Welcome Page](/images/Page0.png)
* A brief assessment of basic information regarding the user, according to which the full course set will be filtered.
![Welcome Page](/images/Page1.png)
* A tree layout allowing the user to filter through courses relevant to him or her. The user can at this stage select courses that he or she is interested in.
![Welcome Page](/images/Page2.png)
* A table layout displaying the courses that were selected by the user. This is enriched with rating information obtained from students that had taken these courses in the past as well as a timetable view.
![Welcome Page](/images/Page3.png)

The application was developed in html, css, JavaScript and node.js.
Bootstrap was used to enhance its appearance, while D3 was used to build the visualizations.

It can be run locally after starting a local server, e.g. using node.js.
A deployed version is available at: https://mariebexte.github.io/E3_Selector/.
