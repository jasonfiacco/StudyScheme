class User {
  constructor(id, creditsNeeded) {
    this.id = parseInt(id);
    this.creditsNeeded = parseInt(creditsNeeded);
    if (isNaN(this.creditsNeeded)) {
      this.creditsNeeded = 0;
    }
    this.courses = {};
    this.majors = {};
  }

  //////////////////////////////
  // Loaders
  /**
  * Loads a User from JSON
  * @return User
  **/
  static loadUserFromJSON(json) {
    var user = new User(json["id"], json["credits_needed"]);
    var majors = json["majors"];
    var courses = json["courses"];
    for (var majorIndex in majors) {
      var major = Major.loadMajorFromJSON(majors[majorIndex]);
      user.addMajor(major)
    }
    for (var courseIndex in courses) {
      var course = Course.loadCourseFromJSON(courses[courseIndex]);
      user.addCourse(course);
    }
    return user;
  }

  /////////////////////////////////////////
  // Calcuations

  /**
  * Calculates the number of credits taken, counting only completed classes
  * @return double that represents the number of credits taken
  **/
  creditsTaken() {
    var credits = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed()) {
        credits += course.getCredits();
      }
    }
    return credits;
  }

  /**
  * Calculates the anticipated number of credits to be taken
  * Where only classes that have an anticipated or acutal grade are counted
  * @param maxSemester[int]
  * @return double representing the number of credits taken
  **/
  anticipatedCreditsTaken(maxSemester) {
    var credits = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed() || 
          (course.anticipated() && course.getSemester() <= maxSemester)) {
        credits += course.getCredits();
      }
    }
    return credits;
  }

  /**
  * Calculates the number of credits the user still needs to take
  * returning 0 if the user has reached sufficient credits
  * @return double representing how many credits still need to be taken
  **/
  creditsRemaining() {
    return Math.max(this.creditsNeeded - this.creditsTaken(), 0)
  }

  /**
  * Adds a major to the major list
  * @param major[Major] major to be added
  **/
  addMajor(major) {
    this.majors[major.getID()] = major;
  }

  /**
  * Adds a course to the courselist
  * @param course[Course] course to be added
  **/
  addCourse(course) {
    this.courses[course.getID()] = course;
  }

  /**
  * Calculates the current GPA, weighted by how many credits the class is worth
  * @return double that represents the GPA
  **/
  currentGPA() {
    var weightedTotal = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed()) {
        weightedTotal += course.getCredits() * course.getActualGrade();
      }
    }
    return getGPA(weightedTotal / this.creditsTaken());
  }

  /**
  * Determines the anticipated GPA by a certain semester
  * Uses the completed grade if it exists, otherwise the anticipated grade
  * @param maxSemester[int] 
  * @return double that represents the anticipated GPA
  **/
  anticipatedGPA(maxSemester) {
    var weightedTotal = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed()) {
        weightedTotal += course.getCredits() * course.getActualGrade();
      } 
      else if (course.anticipated() && course.getSemester() <= maxSemester) {
        weightedTotal += course.getCredits() * course.getAnticipatedGrade();
      }
    }
    return getGPA(weightedTotal / this.anticipatedCreditsTaken(maxSemester));    
  }

  /**
  * Calculates the highest GPA of user assuming they only take
  * as many credits as needed
  * @return double of highest grade user can obtain
  **/
  highestGPA(maxSemester) {
    if (this.getCompletedSemester >= maxSemester) {
      return this.currentGPA();
    }
    var weightedTotal = 0;

    //get the current weighted total GPA
    var creditsTaken = this.creditsTaken();
    weightedTotal += this.currentGPA() * creditsTaken;

    //Check how many semesters remain
    var completedSemesters = this.getCompletedSemester();
    var semestersLeft = MAX_SEMESTERS - completedSemesters;
    if (semestersLeft <= 0) {
      return this.currentGPA();
    }

    //Check how many more semesters we need to take
    var semestersToTake = maxSemester - completedSemesters;
    var creditsToTake = Math.max(this.creditsRemaining() * semestersToTake / semestersLeft, 0);
    //Add the higest weight possible and calculate GPA
    weightedTotal += 4.0 * creditsToTake;
    return getGPA(weightedTotal / (creditsToTake + creditsTaken));
  }

  /**
  * Removes the major with id from majors
  * @param id[int]
  * @return bool indicating success
  **/
  removeMajor(id) {
    if (id in this.majors) {
      delete this.majors[id];
      return true;
    }
    return false;
  }

  /**
  * Removes the major with id from majors
  * @param id[int]
  * @return bool indicating success
  **/
  removeCourse(id) {
    if (id in this.courses) {
      delete this.courses[id];
      return true;
    }
    return false;
  }  

  /////////////////////////
  // Getters and Setters

  /**
  * Gets the max of the semesters of the courses completed
  * We assume completed if user has completed a course in that semester
  * @return integer representing the greatest completed semester
  **/
  getCompletedSemester() {
    var maxSemester = 0;
    for (var courseID in this.courses) {
      var course = this.courses[courseID];
      if (course.completed()) {
        if (course.getSemester() > maxSemester) {
          maxSemester = course.getSemester();
        }
      }
    }
    return maxSemester;
  }

  getCreditsNeeded() {
    return this.creditsNeeded;
  }

  getMajors() {
    return this.majors;
  }

  getMajorsList() {
    var majors = [];
    for (var majorID in this.majors) {
      majors.push(this.majors[majorID]);
    }
    return majors;
  }

  getMajorIDtoName() {
    var majors = {};
    for (var majorID in this.majors) {
      majors[majorID] = this.majors[majorID].getName()
    }
    return majors;
  }

  getMajor(id) {
    return this.majors[id];
  }

  getCourse(id) {
    return this.courses[id];
  }

  getMajorIDList() {
    return Object.keys(this.majors);
  }

  getMajorNameList() {
    var names = [];
    for (var majorID in this.majors) {
      var major = this.majors[majorID];
      names.push(major.getName());
    }
    return names;
  }

  getCourseIDList() {
    return Object.keys(this.courses);
  }

  getCourses() {
    return this.courses;
  }

  getCoursesList() {
    var courses = [];
    for (var coursesID in this.courses) {
      courses.push(this.courses[coursesID]);
    }
    return courses;    
  }

  setCreditsNeeded(credits) {
    this.creditsNeeded = parseInt(credits);
  }

  ////////////////////////
  // Networking Stuff

  /**
  * Sends a list of current Majors in JSON form
  **/
  sendCurrentMajors() {
    $.ajax({
      url: "/academic_manager/update_majors",
      contentType: "application/json",
      type: "PUT",
      data: JSON.stringify({"majors" : this.getMajorsList()}),

      success: function(response) {
        //TODO: action on success
        console.log("sucessfully updated majors");
      },

      error: function(response) {
        //TODO: action on failure
        console.log("error updating majors");
      }
    });
  }

  /**
  * Sends a list of current courses in JSON form
  **/
  sendCurrentCourses() {
    $.ajax({
      url: "/academic_manager/update_courses",
      contentType: "application/json",
      type: "PUT",
      data: JSON.stringify({"courses" : this.getCoursesList()}),

      success: function(response) { 
        //TODO: action on success
        console.log("sucessfully updated courses");
      },

      error: function(response) {
        //TODO: action on failure
        console.log("error updating courses");
      }
    });
  }

  /**
  * Sends the Current User to the server
  **/
  sendCurrentUser() {
    $.ajax({
      url: "/academic_manager/update_user",
      contentType: "application/json",
      type: "PUT",
      data: JSON.stringify(this),

      success: function(response) { 
        //TODO: action on success
        console.log("sucessfully updated courses");
      },

      error: function(response) {
        //TODO: action on failure
        console.log("error updating courses");
      }
    });      
  }


  /////////////////////////
  //JSON stuff
  toJSON() {
    return {
      "id" : this.id,
      "creditsNeeded" : this.creditsNeeded,
      "courses" : this.getCoursesList(),
      "majors" : this.getMajorsList()
    };
  }
}
