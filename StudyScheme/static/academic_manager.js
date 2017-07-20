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
* @param major[Major]
* @return boolean indicating success or failure
**/
function renderMajor(major) {
  var row = document.createElement("tr");
  row.id = "major-" + major.getID();

  var majorData = document.createElement("td");
  var majorEntry = document.createElement("input");
  majorEntry.type = "text";
  majorEntry.value = major.getName();
  majorEntry.id = "majorName-" + major.getID();
  majorEntry.className += "majorName"
  majorEntry.className += " major-field";
  majorData.appendChild(majorEntry);

  //render input for credits needed
  var creditsData = document.createElement("td");
  var creditsEntry = document.createElement("input");
  creditsEntry.type = "text";
  creditsEntry.value = major.getCreditsNeeded();
  creditsEntry.id = "creditsNeeded-" + major.getID();
  creditsEntry.className += "creditsNeeded";
  creditsEntry.className += " major-field";
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

/**
* Creates a new course, renders it, and adds it to the current user
* @param id[int], name[String], credits[double], semester[int]
* @return boolean represeting success
**/
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

/**
* Renders the course presented onto course table
* @param course[Course]
* @return boolean representing success
**/
function renderCourse(course) {
  var row = document.createElement("tr");
  row.id = "course-" + course.getID();

  var courseTitleData = document.createElement("td");
  var courseTitleInput = document.createElement("input");
  courseTitleInput.value = course.getName();
  courseTitleInput.className += " course-title";
  courseTitleInput.id = "courseTitle-" + course.getID();
  courseTitleData.appendChild(courseTitleInput);

  var creditsData = document.createElement("td");
  var creditsInput = document.createElement("input");
  creditsInput.value = course.getCredits();
  creditsInput.className += " course-credits";
  creditsInput.id = "courseCredits-" + course.getID();
  creditsData.appendChild(creditsInput);

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
  
  /**
  * Adds the semesters to the various dropdowns
  **/
  $("#course_planner_semester").append(createSemesterSelector());
  $("#anticipated_GPA_semester").append(createSemesterSelector());
  $("#highest_GPA_semester").append(createSemesterSelector());
});

function sendCurrentMajors() {
  //TODO: ajax to send JSON of user
  $.ajax({
    url: "/academic_manager/update_majors",
    contentType: "application/json",
    type: "PUT",
    dataType: "application/json",
    data: JSON.stringify({"majors" : user.getMajors()}),

    success: function(response) {

    },

    error: function(response) {
      console.log("error updating majors");
    }
  });
  return;
}

function sendCurrentCourses() {
  //TODO: ajax to send JSON of user
  $.ajax({
    url: "/academic_manager/update_courses",
    contentType: "application/json",
    type: "PUT",
    dataType: "application/json",
    data: JSON.stringify({"courses" : user.getCourses()}),

    success: function(response) {

    },

    error: function(response) {
      console.log("error updating coures");
    }
  });
  return;
}

$(document).ready(function() {
  console.log("page ready");

  /**
  * When the user changes the credits needed for a major
  * Updates the major in user
  * and updates the credits remaining display for the major
  * Finally sends the updated major to the server
  **/
  $("#intended_majors").on("change", ".creditsNeeded", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var major = user.getMajor(id);
    major.setCreditsNeeded($(this).val());
    var target = "#creditsRemaining-" + id;
    $(target).html(major.creditsRemaining())
    sendCurrentMajors();
  });

  /**
  * When the user changes the major name
  * updates major in the user
  * and sends the updated major to the server
  **/
  $("#intended_majors").on("change", ".majorName", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var major = user.getMajor(id);
    major.setName($(this).val());
    sendCurrentMajors();
  });

  $("#course_planner").on("change", ".course-title", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var course = user.getCourse(id);
    course.setName($(this).val());
    sendCurrentCourses();
  });

  $("#course_planner").on("change", ".course-credits", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var course = user.getCourse(id);
    course.setCredits($(this).val());
    sendCurrentCourses();
  });

  $("#course_planner").on("change", ".anticipated-grade", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var course = user.getCourse(id);
    course.setAnticipatedGrade($(this).val());
    sendCurrentCourses();
  });

  $("#course_planner").on("change", ".actual-grade", function() {
    var id = getIdFromHtmlId($(this).attr("id"));
    var course = user.getCourse(id);
    course.setActualGrade($(this).val());
    sendCurrentCourses();
  });
  /**
  * When the user clicks on the add course button
  * Send a request to the server to create a new course
  * And add that created course into user and onto the page
  **/
  $("#add_course").click(function() {
    console.log($("#course_planner_semester").val());
    $.ajax({
      url: "/academic_manager/create_course",
      contentType: "application/json",
      type: "POST",
      dataType: "application/json",

      data: JSON.stringify({
        "semester" : $("#course_planner_semester > select").val(),
      }),

      statusCode: {
        201 : function(result) {
          var obj = $.parseJSON(result.responseText);
          var course = obj.course;
          addCourse(course.id, course.name, course.credits, course.semester);
        }
      },
    });
  });

  /**
  * When the user clicks on this button
  * Requests a new major from the server
  * adds the new major to the user
  * and displays the new major on the page
  **/
  $("#add_major").click(function() {
    if (user.getMajorNameList().includes("")) {
      console.log("Blank major already exists");
      return;
    }
    $.ajax({
      url: "/academic_manager/create_major",
      contentType: "application/json",
      type: "POST",
      dataType: "application/json",

      statusCode: {
        201: function(result) {
          var obj = $.parseJSON(result.responseText);
          var major = obj.major;
          addMajor(major.id, "", major.credits_needed);
        }
      },
    });
  });
});
