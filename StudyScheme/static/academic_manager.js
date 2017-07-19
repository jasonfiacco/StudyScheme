//Structure to keep track of values in editor
var editorValues = {
  "majors" : {

  }, 
  "courses" : {

  }
};

var GRADE_CONVERSIONS = {
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
  13 : 'A+'
};

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
  var courses = editorValues["courses"];
  var credits = 0;
  for (var course : courses) {
    credits += courses[course]["credits"];
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
  for (var courseID : major["courses"]) {
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

function actualAverageGPA() {
  return 0;
}

function anticipatedAverageGPA() {
  return 0;
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
