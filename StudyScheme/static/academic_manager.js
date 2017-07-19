//Structure to keep track of values in editor
var editorValues = {
  "majors" : {

  }, 
  "courses" : {

  }
};

var GRADE_CONVERSIONS = {
  -1 : '-',
   0 : 'F',
   2 : 'D-',
   3 : 'D',
   4 : 'D+',
   5 : 'C-',
   6 : 'C',
   7 : 'C+',
   8 : 'B-',
   9 : 'B',
  10 : 'B+',
  11 : 'A-',
  12 : 'A',
  13 : 'A+',
};

class Course {
  constructor(id, name, credits, semester) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.semester = semester;
    this.majors = [];
    this.actualGrade = -1;
    this.anticipatedGrade = -1;
  }

  /**
  * Determines if class is taken yet
  * @return boolean representing whether course has been taken yet
  **/
  completed() {
    return this.actualGrade != -1;
  }

  /**
  * Determines if this course has an anticipated grade
  * @return boolean representing whether course has anticipated grade
  **/
  anticipated() {
    return this.anticipatedGrade != -1;
  }

  /////////////////
  //setters and getters

  /**
  * gets the number of credits this course is worth
  * @return double or integer
  **/
  getCredits() {
    return this.credits;
  }

  getActualGrade() {
    return this.actualGrade;
  }

  getAnticipatedGrade() {
    return this.anticipatedGrade;
  }

  getID() {
    return this.id;
  }

  /**
  * Sets the actual grade of the course
  * @param grade[integer] representing grade
  **/
  setActualGrade(grade) {
    this.actualGrade = grade;
  }

  /**
  * Sets the anticipated grade of the course
  * @param grade[integer] representing grade
  **/
  setAnticipatedGrade(grade) {
    this.anticipatedGrade = grade;
  }
  //////////////////////

  //////////////////////
  //JSON stuff
  getMajorIDList() {
    var majors = [];
    for (major : majors) {
      majors.push(major.getID());
    }
    return majors;
  }

  toJSON() {
    return {
      "id" : this.id, 
      "name" : this.name,
      "actualGrade" : this.actualGrade,
      "anticipatedGrade" : this.anticipatedGrade;
      "semester" : this.semester;
      "majors" : this.getMajorIDList();
    };
  }
}

class Major {
  constructor(id, name, creditsNeeded) {
    this.id = id;
    this.name = name;
    this.creditsNeeded = creditsNeeded;
    this.courses = []
  }

  creditsTaken() {
    var credits = 0;
    for (course in courses) {
      if (course.completed()) {
        credits += course.getCredits();
      }
    }
    return credits;
  }

  creditsRemaining() {
    return max(this.creditsNeeded - this.creditsTaken(), 0);
  }

  currentGPA() {
    var weightedTotal = 0;
    for (course in courses) {
      weightedTotal += course.actualGrade * course.credits;
    }
    return getGPA(weightedTotal / this.creditsTaken());
  }

  /////////////////////////
  //setters and getters
  getID() {
    return this.id;
  }

  getCreditsNeeded() {
    return creditsNeeded;
  }

  setCreditsNeeded(credits) {
    this.creditsNeeded = credits;
  }
  ////////////////////////

  //JSON Stuff
  getCourseIDList() {
    var courseIDs = []
    for (course in courses) {
      courseIDs.push(course.getID);
    }
    return courseIDs;
  }

  toJSON() {
    return {
      "id" : this.id,
      "name" : this.name,
      "creditsNeeded" : this.creditsNeeded,
      "courses" : this.getCourseIDList();
    };
  }
}

class User {
  constructor(id, creditsNeeded) {
    this.id = id;
    this.creditsNeeded = creditsNeeded;
    this.courses = [];
    this.majors = [];
  }

  creditsTaken() {
    var credits = 0;
    for (course in courses) {
      if (course.completed()) {
        credits += course.getCredits();
      }
    }
    return credits;
  }

  anticipatedCreditsTaken() {
    var credits = 0;
    for (course in courses) {
      if (course.completed() || course.anticipated()) {
        credits += course.getCredits();
      }
    }
    return credits;
  }

  creditsRemaining() {
    return max(creditsNeeded - this.creditsTaken(), 0)
  }

  addMajor(major) {
    this.majors.push(major);
  }

  addCourse(course) {
    this.courses.push(course);
  }

  currentGPA() {
    var weightedTotal = 0;
    for (course in courses) {
      if (course.completed()) {
        weightedTotal += course.getCredits() * course.getActualGrade();
      }
    }
    return getGPA(weightedTotal / this.creditsTaken());
  }

  anticipatedGPA() {
    var weightedTotal = 0;
    for (course in courses) {
      if (course.completed()) {
        weightedTotal += course.getCredits() * course.getActualGrade();
      } 
      else if (course.anticipated()) {
        weightedTotal += course.getCredits() * course.getAnticipatedGrade();
      }
    }
    return getGPA(weightedTotal / this.anticipatedCreditsTaken());    
  }

  /**
  * Calculates the highest GPA of user assuming they only take
  * as many credits as needed
  * @return double of highest grade user can obtain
  **/
  highestGPA() {
    var weightedTotal = 0;
    weightedTotal += this.currentGPA() * this.creditsTaken();
    weightedTotal += 4.0 * this.creditsRemaining();
    return getGPA(weightedTotal / this.creditsNeeded);
  }

  /////////////////////////
  // Getters and Setters
  getCreditsNeeded() {
    return this.creditsNeeded;
  }

  setCreditsNeeded(credits) {
    this.creditsNeeded = credits;
  }
  /////////////////////////

  //JSON stuff
  toJSON() {
    return {
      "id" : id,
      "creditsNeeded" : this.creditsNeeded,
      "courses" : courses,
      "majors" : majors
    }
  }
}

/**
* Calculates the grade from the current score
* Note: uses the fixed calculations for now, assumes max is 4.0
* @return double represeting GPA
**/
function getGPA(score) {
  return min(score / 3.0, 4.0);
}

/**
* Gets the total number of credits completed
* @return integer representing the total number of credits completed
**/
function creditsCompleted() {
  var user = editorValues["user"];
  var courses = editorValues["courses"];
  var credits = 0;
  for (var courseID in courses) {
    var course = courses[courseID];
    if (course["semester"] > user["semester"]) {
      continue;
    }
    credits += course["credits"];
  }
  return credits;
}

/**
* Calculates the number of credits completed in the major
* @param majorID[integer]
* @return integer representing the number of credits completed
**/
function majorCreditsCompleted(majorID) {
  var majors = editorValues["majors"];
  if (!(majorID in majors)) {
    console.log("Major " + majorID + " does not exist");
    return 0;
  }
  major = majors[majorID];
  credits = 0;
  for (var courseID in major["courses"]) {
    credits += getCourseCredits(courseID);
  }
  return credits;
}

/**
* Gets the amount of credits a course is worth
* @param courseID[integer]
* @return integer representing the number of credits the course is worth
**/
function getCourseCredits(courseID) {
  var courses = editorValues["courses"];
  if (!(courseID in courses)) {
    console.log("Course " + courseID + " does not exist");
    return 0;
  }
  return courses[courseID]["credits"];
}



/**
* Fetches the grade by type actual or anticipated
* @param type[String] type of grade calulation (actual vs anticipated)
* @return double representing the calculated GPA
**/
function averageGPAHelper(type, startSemester, maxSemester) {
  var courses = editorValues["courses"];
  var weightedSum = 0;
  for (courseID in courses) {
    var course = courses[courseID];
    if (course["semester"] < startSemester || course["semester"] > maxSemester) {
      continue;
    }
    weightedSum += course[type] * course['credits'];
  }
  return getGPA(weightedSum / creditsCompleted());
}

/**
* gets the actual GPA
* @return double representing actual GPA
**/
function actualAverageGPA() {
  return averageGPAHelper('actual_grade', 0, editorValues["user"]["semester"]);
}

/**
* get the the Anticipated GPA 
*
**/
function anticipatedAverageGPA() {
  return averageGPAHelper('anticipated_grade');
}

function highestPossibleGPA() {
  return 0;
}

function majorGPA(majorID) {
  return 4.0;
}

/**
* Renders the major, then adds it to the dictionary
* @param id[int], major[string], creditsNeeded[double]
* @return boolean indicating success or failure
**/
function addMajor(id, major, creditsNeeded) {
  var majors = editorValues["majors"]

  if (renderMajor(id, major, creditsNeeded)) {
    //add to dictionary
    majorDict = {};
    majorDict["name"] = major;
    majorDict["credits"] = creditsNeeded;
    majorDict["courses"] = [];
    majors[id] = majorDict;
    return true;
  }
  return false;
}

/**
* Adds a major to the intended_majors tables
* @param id[int], major[string], creditsNeeded[double]
* @return boolean indicating success or failure
**/
function renderMajor(id, major, creditsNeeded) {
  var majors = editorValues["majors"]
  if (id in majors) {
    console.log("Major " + id + " already exists");
    return false;
  }

  var row = document.createElement("tr");
  row.id = "major-" + id;

  var majorData = document.createElement("td");
  majorData.innerHTML = major;

  //render input for credits needed
  var creditsData = document.createElement("td");
  var creditsEntry = document.createElement("input");
  creditsEntry.type = "text";
  creditsEntry.value = creditsNeeded;
  creditsEntry.id = "creditsNeeded-" + id;
  creditsEntry.className += "creditsNeeded"
  creditsData.appendChild(creditsEntry);

  //render remaining credits needed 
  var creditsRemainingData = document.createElement("td");
  creditsRemainingData.id = "creditsRemaining-" + id;
  creditsRemainingData.innerHTML = creditsNeeded;

  //render GPA slot
  var majorGPAData = document.createElement("td");
  majorGPAData.id = "majorGPA-" + id;
  majorGPAData.innerHTML = majorGPA(id).toFixed(2);

  row.appendChild(majorData);
  row.appendChild(creditsData);
  row.appendChild(creditsRemainingData);
  row.appendChild(majorGPAData);
  $("#intended_majors").append(row);

  return true;
}

function addCourse(id, course, credits, contributesTo, 
  anticipatedGrade, actualGrade, semester) {
  var row = document.createElement("tr");
  row.id = "course-" + id;

  var courseTitleData = document.createElement("td");
  courseTitleData.text = course;

  var creditsData = document.createElement("td");
  creditsData.text = credits;

  var contributesToData = document.createElement("td");

}

$(function() {
  $("#credits_needed").change(function(){
    $("#credits_remaining").text(parseInt($("#credits_needed").val()) - creditsCompleted());
  });
});
