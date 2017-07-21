class Major {
  constructor(id, name, creditsNeeded, courses) {
    this.id = id;
    this.name = name.trim();
    this.creditsNeeded = creditsNeeded;
    this.courses = {};
    for (var course in courses) {
      var courseID = courses[course];
      this.courses[courseID] = user.getCourse(courseID);
    }
  }

  //////////////////////////////////////
  // Loaders
  static loadMajorFromJSON(json) {
    return new Major(json["id"], json["name"], json["credits_needed"]);
  }

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

  creditsRemaining() {
    return Math.max(this.creditsNeeded - this.creditsTaken(), 0);
  }

  currentGPA() {
    var weightedTotal = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      weightedTotal += course.actualGrade * course.credits;
    }
    return getGPA(weightedTotal / this.creditsTaken());
  }

  addCourse(course) {
    this.courses[course.getID()] = course;
  }

  /////////////////////////
  //setters and getters
  getID() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getCreditsNeeded() {
    return this.creditsNeeded;
  }

  getCourses() {
    return this.courses;
  }

  setCreditsNeeded(credits) {
    this.creditsNeeded = parseInt(credits);
  }

  setName(name) {
    this.name = name.trim();
  }

  //////////////////////////////
  // Networking
  deleteCurrentMajor(action) {
    $.ajax({
      url: "/academic_manager/delete_major",
      contentType: "application/json",
      type: "DELETE",
      data: JSON.stringify(this),

      statusCode: {
        202: function(response) {
          action(response);
          console.log("sucessfully deleted major");
        }
      },

      error: function(response) {
        //TODO: action on failure
        console.log("error deleting majors");
      }
    });
  }


  ////////////////////////
  //JSON Stuff
  getCourseIDList() {
    var courseIDs = []
    for (var course in this.courses) {
      course = this.courses[course];
      courseIDs.push(course.getID);
    }
    return courseIDs;
  }

  toJSON() {
    return {
      "id" : this.id,
      "name" : this.name,
      "credits_needed" : this.creditsNeeded,
      "courses" : this.getCourseIDList(),
    };
  }
}
