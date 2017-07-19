var values = {
  "majors" : {

  }, 
  "courses" : {

  }
};

function creditsCompleted() {
return 0;
}

function majorCreditsCompleted(majorID) {
  return 0;
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
  var majors = values["majors"]

  if (renderMajor(id, major, creditsNeeded)) {
    //add to dictionary
    majorDict = {};
    majorDict["name"] = major;
    majorDict["credits"] = creditsNeeded;
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
  var majors = values["majors"]
  if (id in majors) {
    console.log("Major " + id + " already exists");
    return false;
  }

  var row = document.createElement("tr");
  row.id = "major-" + id;

  var majorData = document.createElement("td");
  majorData.innerHTML = major;

  var creditsData = document.createElement("td");
  var creditsEntry = document.createElement("input");
  creditsEntry.type = "text";
  creditsEntry.value = creditsNeeded;
  creditsEntry.id = "creditsNeeded-" + id;
  creditsData.appendChild(creditsEntry);

  var creditsRemainingData = document.createElement("td");
  creditsRemainingData.id = "creditsRemaining-" + id;
  creditsRemainingData.innerHTML = creditsNeeded;

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
