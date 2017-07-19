user = new User();

var GRADE_CONVERSIONS = {
  "-1" : "-",
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

/**
* Calculates the grade from the current score
* Note: uses the fixed calculations for now, assumes max is 4.0
* @return double represeting GPA
**/
function getGPA(score) {
  return Math.min(score / 3.0, 4.0);
}


/**
* Renders the major, then adds it to the dictionary
* @param id[int], major[string], creditsNeeded[double]
* @return boolean indicating success or failure
**/
function addMajor(id, major, creditsNeeded) {
  var major = new Major(id, major, creditsNeeded);
  if (renderMajor(major)) {
    user.addMajor(major);
    return true;
  }
  return false;
}

/**
* Adds a major to the intended_majors tables
* @param id[int], major[string], creditsNeeded[double]
* @return boolean indicating success or failure
**/
function renderMajor(major) {
  if (user.getMajorIDList().includes(major.getID())) {
    console.log("Major " + major.getID() + " already exists");
    return false;
  }

  var row = document.createElement("tr");
  row.id = "major-" + major.getID();

  var majorData = document.createElement("td");
  majorData.innerHTML = major.getName();

  //render input for credits needed
  var creditsData = document.createElement("td");
  var creditsEntry = document.createElement("input");
  creditsEntry.type = "text";
  creditsEntry.value = major.getCreditsNeeded();
  creditsEntry.id = "creditsNeeded-" + major.getID();
  creditsEntry.className += "creditsNeeded"
  creditsData.appendChild(creditsEntry);

  //render remaining credits needed 
  var creditsRemainingData = document.createElement("td");
  creditsRemainingData.id = "creditsRemaining-" + major.getID();
  creditsRemainingData.innerHTML = major.creditsRemaining();

  //render GPA slot
  var majorGPAData = document.createElement("td");
  majorGPAData.id = "majorGPA-" + major.getID();
  majorGPAData.innerHTML = major.currentGPA().toFixed(2);

  row.appendChild(majorData);
  row.appendChild(creditsData);
  row.appendChild(creditsRemainingData);
  row.appendChild(majorGPAData);
  $("#intended_majors").append(row);

  return true;
}

function renderCourse(course) {
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
