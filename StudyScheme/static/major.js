class Major {
  /**
  * Constructs a new Major
  * @param id[int], name[string], creditsNeeded[float], courses[list<int>]
  **/
  constructor(id, name, creditsNeeded, courses) {
    this.id = id;
    this.name = name.trim();
    this.creditsNeeded = parseFloat(creditsNeeded);
    this.courses = courses || {};
  }

  //////////////////////////////////////
  // Loaders

  /**
  * Loads a major from JSON
  * @warning must convert list to dictionary with convertListToObjects
  * @param json[JSON]
  * @return Major
  **/
  static loadMajorFromJSON(json) {
    return new Major(json["id"], json["name"], 
      json["credits_needed"], json["courses"]);
  }

  /**
  * Converts the courses list to a courses dictionary
  * @param user[User] a reference for courseID's
  **/
  convertListToObjects(user) {
    var temp = {};
    for (var index in this.courses) {
      var courseID = this.courses[index];
      temp[courseID] = user.getCourse(courseID);
    }
    this.courses = temp;
  }

  /**
  * Calculates how many credits have been taken for this major
  * @return float
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
  * Calculates how many more credits need to be taken for this major
  * @return float
  **/
  creditsRemaining() {
    return Math.max(this.creditsNeeded - this.creditsTaken(), 0);
  }

  /**
  * Calculates the current GPA for this major
  * @return float
  **/
  currentGPA() {
    var weightedTotal = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (!course.completed()) {
        continue;
      }
      weightedTotal += course.actualGrade * course.credits;
    }
    return getGPA(weightedTotal / this.creditsTaken());
  }

  /**
  * Adds the course to the course dictionary
  * @param course[Course]
  **/
  addCourse(course) {
    this.courses[course.getID()] = course;
  }

  /**
  * Toggles whether the major is affected by course
  * @param course[Course]
  **/
  toggleCourse(course) {
    if (course.getID() in this.courses) {
      this.deleteCourse(course);
    } else {
      this.addCourse(course);
    }
  }

  /**
  * Deletes the course from courses
  * @param course[Course]
  **/
  deleteCourse(course) {
    delete this.courses[course.getID()];
  }

  /////////////////////////
  //setters and getters

  /**
  * Gets the ID of the major
  * @return int
  **/
  getID() {
    return this.id;
  }

  /**
  * Gets the name of the major
  * @return string
  **/
  getName() {
    return this.name;
  }

  /**
  * Gets the total number of credits needed for this major
  * @return float
  **/
  getCreditsNeeded() {
    return this.creditsNeeded;
  }

  /**
  * Gets the courses associated with this major
  * @return list<Course>
  **/
  getCourses() {
    return this.courses;
  }

  /**
  * Gets a list of course IDs associated with this major
  * @return list<int>
  **/
  getCourseIDList() {
    var courseIDs = []
    for (var course in this.courses) {
      course = this.courses[course];
      courseIDs.push(course.getID);
    }
    return courseIDs;
  }

  /**
  * Sets the number of credits needed for this major
  * @param credits[float]
  **/
  setCreditsNeeded(credits) {
    this.creditsNeeded = parseFloat(credits);
  }

  /**
  * Sets the name of the major
  * @param name[string]
  **/
  setName(name) {
    this.name = name.trim();
  }

  //////////////////////////////
  // Networking

  /**
  * Sends a request to server to delete this major
  * @param actionSuccess[function]
  **/
  deleteCurrentMajor(actionSuccess) {
    $.ajax({
      url: "/academic_manager/delete_major",
      contentType: "application/json",
      type: "DELETE",
      data: JSON.stringify(this),

      statusCode: {
        202: function(response) {
          actionSuccess(response);
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

  /**
  * Converts major to a JSON object
  * @return dictionary (JSON)
  **/
  toJSON() {
    return {
      "id" : this.id,
      "name" : this.name,
      "credits_needed" : this.creditsNeeded,
      "courses" : this.getCourseIDList(),
    };
  }
}
