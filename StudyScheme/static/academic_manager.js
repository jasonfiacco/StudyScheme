var user;

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
function addMajor(id, name, creditsNeeded, majors) {
  if (user.getMajor(id) ||  user.getMajorNameList().includes(name)) {
    console.log("Major " + id + " or " + name + " already exists");
    return false;
  }

  var major = new Major(id, name, creditsNeeded, majors);

  if (renderMajor(major)) {
    user.addMajor(major);
    return true;
  }
  return false;
}

/**
* Creates a delete button
* @param id[string], buttonClass[string]
* @return DOM object
**/
function createDeleteButton(id, buttonClass) {
  var button = document.createElement("button");
  button.id = id;
  button.innerHTML = "Delete";
  button.className = buttonClass;
  button.className += " btn btn-danger";
  return button;
}

/**
* Adds a major to the intended_majors tables
* @param major[Major]
* @return boolean indicating success or failure
**/
function renderMajor(major) {
  var row = document.createElement("tr");
  row.id = "major-" + major.getID();
  row.className += "major";

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
  creditsRemainingData.class += "creditsRemaining";
  creditsRemainingData.id = "creditsRemaining-" + major.getID();
  creditsRemainingData.innerHTML = major.creditsRemaining();

  //render GPA slot
  var majorGPAData = document.createElement("td");
  majorGPAData.id = "majorGPA-" + major.getID();
  majorGPAData.innerHTML = major.currentGPA().toFixed(2);

  var deleteMajorData = document.createElement("td");
  var button = createDeleteButton("delete_major-" + major.getID(), 
    "delete-major");
  deleteMajorData.appendChild(button);

  row.appendChild(majorData);
  row.appendChild(creditsData);
  row.appendChild(creditsRemainingData);
  row.appendChild(majorGPAData);
  row.appendChild(deleteMajorData);
  $("#intended_majors").append(row);

  return true;
}

/**
* Creates a new course, renders it, and adds it to the current user
* @param id[int], name[String], credits[double], semester[int]
* @return boolean represeting success
**/
function addCourse(id, name, credits, semester, 
  actualGrade, anticipatedGrade, majors) {
  if (user.getCourse(id)) {
    console.log("Course " + id + " already exists");
    return false;
  }

  var course = new Course(id, name, credits, semester, 
    actualGrade, anticipatedGrade, majors);

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
  row.className += "course";

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

  var deleteCourseData = document.createElement("td");
  var button = createDeleteButton("delete_course-" + course.getID(), 
    "delete-course");
  deleteCourseData.appendChild(button);

  row.appendChild(courseTitleData);
  row.appendChild(creditsData);
  row.appendChild(contributesToData);
  row.appendChild(anticipatedGradeData);
  row.appendChild(actualGradeData);
  row.appendChild(deleteCourseData);

  $("#course_planner").append(row);

  return true;
}

/**
* Gets the ID from the HTML ID assuming naming conventions are met
* @param HtmlId[String]
* @return String that represents the id 
**/
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

  user = new User();
});

/**
* Refreshes the number of credits remaining in the interface
**/
function refreshCreditsRemaining() {
  $("#credits_remaining").html(user.creditsRemaining());
}

/**
* Refreshes all of the major credits remaining
**/
function refreshMajorsCreditsRemaining() {
  $(".creditsRemaining").each(function(index) {
    var id = getIdFromHtmlId($(this).attr("id"));
    $(this).html(user.getMajor(id).creditsRemaining());
  });
}

/**
* Refreshes current GPA
**/
function refreshActualGPA() {
  $("#actual_gpa").html(user.currentGPA().toFixed(2));
}

/**
* Refreshes Anticipated GPA
**/
function refreshAnticipatedGPA() {
  var maxSemester = $("#anticipated_GPA_semester > select").val();
  $("#anticipated_gpa").html(user.anticipatedGPA(maxSemester).toFixed(2));
}

/**
* Refreshes Highest Possible GPA
**/
function refreshHighestGPA() {
  var maxSemester = $("#highest_GPA_semester > select").val();
  $("#highest_gpa").html(user.highestGPA(maxSemester).toFixed(2));
}

function refreshCreditsNeeded() {
  $("#credits_needed").val(user.getCreditsNeeded());
}

/**
* Fast refreshes the interface
**/
function refreshInterfaceFast() {
  refreshCreditsRemaining();
  refreshMajorsCreditsRemaining();
  refreshActualGPA();
  refreshAnticipatedGPA();
  refreshHighestGPA();
  refreshCreditsNeeded();
}

/**
* Clears the course planner and then puts the current semester courses
**/
function refreshCoursePlanner(semester) {
  //remove all children
  $("#course_planner > tbody").children(".course").remove();
  var courses = user.getCourses();
  for (var courseID in courses) {
    var course = user.getCourse(courseID);
    if (course && course.getSemester() == semester) {
      renderCourse(course);
    }
  }
}

/**
* Refreshes the course planner fully
**/
function refreshCoursePlannerFull() {
  var currentSemester = $("#course_planner_semester > select").val();
  refreshCoursePlanner(currentSemester);
}

/**
* Refreshes all majors on the page
**/
function refreshMajors() {
  $("#intended_majors > tbody").children(".major").remove();
  var majors = user.getMajors();
  for (var majorID in majors) {
    var major = user.getMajor(majorID);
    if (major) {
      renderMajor(major);
    }
  }
}

/**
* Completely refreshes the interface by removing all entries
* then repopulates from data in user
**/
function refreshInterfaceFull() {
  refreshCoursePlannerFull();
  refreshMajors();
  refreshInterfaceFast();
}

/**
* Runs only once when the page loads
**/
function onStartLoad() {
  $("#course_planner_semester > select").val(Math.max(user.getCompletedSemester(), 1));
  refreshInterfaceFull();
}

$(document).ready(function() {
  /**
  * Loads a user from network and returns a user object
  **/
  $.ajax({
    url: "/academic_manager",
    contentType: "application/json",
    type: "GET",
    dataType: "application/json",

    statusCode: {
      200: function(result) {
        var obj = $.parseJSON(result.responseText);
        user = User.loadUserFromJSON(obj);
        onStartLoad();
        userLoadedHandler();
      }
    },
  });

  function userLoadedHandler() {  
    console.log("page ready");


    ////////////////////////////////////////////////////////
    // Intended Major changes

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
      $(target).html(major.creditsRemaining());
      refreshInterfaceFast();
      user.sendCurrentMajors();
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
      refreshInterfaceFast();
      user.sendCurrentMajors();
    });


    ///////////////////////////////////////////////////////
    // Course Changes

    /**
    * When course-title changes, make changes in user
    * and then submit user to server
    **/
    $("#course_planner").on("change", ".course-title", function() {
      var id = getIdFromHtmlId($(this).attr("id"));
      var course = user.getCourse(id);
      course.setName($(this).val());
      refreshInterfaceFast();
      user.sendCurrentCourses();
    });

    /**
    * When course-credits changes, make changes in user
    * refresh interfance, and submit user to server
    **/
    $("#course_planner").on("change", ".course-credits", function() {
      var id = getIdFromHtmlId($(this).attr("id"));
      var course = user.getCourse(id);
      course.setCredits($(this).val());
      refreshInterfaceFast();
      user.sendCurrentCourses();
    });

    /**
    * When anticipated-grade changes, make changes in user
    * refresh interface, and submit user to server
    **/
    $("#course_planner").on("change", ".anticipated-grade", function() {
      var id = getIdFromHtmlId($(this).attr("id"));
      var course = user.getCourse(id);
      course.setAnticipatedGrade($(this).val());
      refreshInterfaceFast();
      user.sendCurrentCourses();
    });

    /**
    * When actual-grade changes, make changes in user
    * refresh interface, and submit user to server
    **/
    $("#course_planner").on("change", ".actual-grade", function() {
      var id = getIdFromHtmlId($(this).attr("id"));
      var course = user.getCourse(id);
      course.setActualGrade($(this).val());
      refreshInterfaceFast();
      user.sendCurrentCourses();
    });

    $("#course_planner_semester > select").change(
      refreshCoursePlannerFull);

    ///////////////////////////////////
    // Adding new elements

    /**
    * When the user clicks on the add course button
    * Send a request to the server to create a new course
    * And add that created course into user and onto the page
    **/
    $("#add_course").click(function() {
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
            addCourse(course.id, course.name, course.credits, course.semester, 
              course.actual_grade, course.anticipated_grade, course.majors);
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
            addMajor(major.id, major.name, major.credits_needed, major.courses);
          }
        },
      });
    });

    /**
    * When the user changes the credits needed
    * Updates the credits needed with server and Credits remaining
    **/
    $("#credits_needed").change(function() {
      user.setCreditsNeeded($("#credits_needed").val());
      refreshInterfaceFast();
      user.sendCurrentUser();
    });

    /////////////////////////
    // GPA Manager Events

    $("#anticipated_GPA_semester > select").change(
      refreshInterfaceFast);

    $("#highest_GPA_semester > select").change(
      refreshInterfaceFast);

    //////////////////////////
    // Delete Events
    $("#course_planner > tbody").on("click", ".delete-course", function() {
      var id = getIdFromHtmlId($(this).attr("id"));
      user.getCourse(id).deleteCurrentCourse(function() {
        user.removeCourse(id);
        refreshCoursePlannerFull();
      });
    });

    $("#intended_majors > tbody").on("click", ".delete-major", function() {
      var id = getIdFromHtmlId($(this).attr("id"));
      user.getMajor(id).deleteCurrentMajor(function() {
        user.removeMajor(id);
        refreshMajors();
      });
    });      
  }
});
