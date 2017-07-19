var user = new User();

var MAX_SEMESTERS = 8;

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
function addMajor(id, name, creditsNeeded) {
  if (user.getMajor(id) ||  user.getMajorNameList().includes(name)) {
    console.log("Major " + id + " or " + name + " already exists");
    return false;
  }

  var major = new Major(id, name, creditsNeeded);

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

function createCourse() {
  //TODO: ajax stuff


}

function addCourse(id, name, credits, semester) {
  if (user.getCourse(id)) {
    console.log("Course " + id + " already exists");
    return false;
  }

  var course = new Course(id, name, credits, semester);

  if (renderCourse(course)) {
    user.addCourse(course);
    return true;
  }
  return false;
}

function renderCourse(course) {
  var row = document.createElement("tr");
  row.id = "course-" + course.getID();

  var courseTitleData = document.createElement("td");
  courseTitleData.innerHTML = course.getName();

  var creditsData = document.createElement("td");
  creditsData.innerHTML = course.getCredits();

  var contributesToData = document.createElement("td");
  //TODO: implement contributesTo
  contributesToData.innerHTML = "Not Yet Implemented";


  var createGradeDropdowns = function(val) {
    var select = document.createElement("select");
    for (var gradeID in GRADE_CONVERSIONS) {
      var option = document.createElement("option");
      option.value = gradeID;
      option.innerHTML = GRADE_CONVERSIONS[gradeID];
      select.appendChild(option);
    }
    return select;
  }

  var anticipatedGradeData = document.createElement("td");
  var select = createGradeDropdowns();
  select.id = "anticipated-" + course.getID();
  select.className = "anticipated-grade";
  select.value = course.getAnticipatedGrade();
  anticipatedGradeData.appendChild(select);

  var actualGradeData = document.createElement("td");
  select = createGradeDropdowns();
  select.id = "actual-" + course.getID();
  select.className = "actual-grade";
  select.value = course.getActualGrade();
  actualGradeData.appendChild(select);

  row.appendChild(courseTitleData);
  row.appendChild(creditsData);
  row.appendChild(contributesToData);
  row.appendChild(anticipatedGradeData);
  row.appendChild(actualGradeData);

  $("#course_planner").append(row);

  return true;
}

function getIdFromHtmlId(HtmlId) {
  return HtmlId.split("-")[1];
}

function sendCurrentUser() {
  //TODO: ajax to send JSON of user
  return;
}

$(window).on("load", function(){
  /**
  * creates a jQuery DOM Selector for semesters
  * @return jQuery object that is a selector
  **/
  function createSemesterSelector() {
    var select = $("<select></select>");
    for (var x = 1; x <= MAX_SEMESTERS; x++) {
      var option = $("<option></option>").val(x).text("Semester " + x);
      select.append(option);
    }
    return select;
  }
  //add semesters
  $("#course_planner_semester").append(createSemesterSelector());
  $("#anticipated_GPA_semester").append(createSemesterSelector());
  $("#highest_GPA_semester").append(createSemesterSelector());
});

$(document).ready(function() {
  console.log("page ready");

  //change in course credits needed
  $("#intended_majors").on("change", ".creditsNeeded", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var major = user.getMajor(id);
    major.setCreditsNeeded($(this).val());
    var target = "#creditsRemaining-" + id;
    $(target).html(major.creditsRemaining())
    sendCurrentUser();
  });

  $("#add_course").click(function() {
    $.ajax({
      url: "/academic_manager/create_course/",
      contentType: "application/json",
      type: "POST",
      dataType: "application/json",

      data: JSON.stringify({
        "semester" : $("#course_planner_semester").val(),
      }),

      success: function(result) {
        var obj = $.parseJSON(result);
        addCourse(obj.id, obj.name, obj.credits, obj.semester);
      },

      failure: function(result) {
        console.log("create_course request failed");
      },
    });
  });

  $("#add_major").click(function() {
    $.ajax({
      url: "/academic_manager/create_major/",
      contentType: "application/json",
      type: "POST",
      dataType: "application/json",

      success: function(result) {
        var obj = $.parseJSON(result);
        addMajor(obj.id, obj.name, obj.creditsNeeded);
      },
      
      failure: function(result) {
        console.log("create_major request failed");
      },
    });
  });
});
