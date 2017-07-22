class Course {
  /**
  * Constructs a new course instance
  * @param id[int], name[string], semester[int]
  * @param actualGrade[int], anticiaptedGrade[int]
  * @param majors[dictionary<int, Major>]
  **/
  constructor(id, name, credits, semester, 
    actualGrade, anticipatedGrade, majors) {
    this.id = id;
    this.name = name.trim();
    this.credits = credits;
    this.semester = semester;
    this.majors = majors || {};
    this.actualGrade = actualGrade;
    this.anticipatedGrade = anticipatedGrade;
  }

  //////////////////////////////////////
  // Loaders

  /**
  * Loads course from JSON
  * @warning must run converListToObjects to convert majors from int to object
  * @param json[dictionary]
  **/
  static loadCourseFromJSON(json) {
    return new Course(json["id"], json["name"], 
      json["credits"], json["semester"],
      json["actual_grade"], json["anticipated_grade"],
      json["majors"]);
  }

  /**
  * Converts a list of majorID's to actual objects
  * @param user[User] reference for majors
  **/
  convertListToObjects(user) {
    var temp = {};
    for (var index in this.majors) {
      var majorID = this.majors[index];
      temp[majorID] = user.getMajor(majorID);
    }
    this.majors = temp;
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

  /**
  * Adds a major to the majors list
  * @param major[Major]
  **/
  addMajor(major) {
    this.majors[major.getID()] = major;
  }

  /**
  * Toggles whether a major is present in majors list
  * @param major[Major]
  **/
  toggleMajor(major) {
    if (major.getID() in this.majors) {
      this.deleteMajor(major);
    } else {
      this.addMajor(major);
    }
  }

  /**
  * Deletes a major from the major list
  * @param major[Major]
  **/
  deleteMajor(major) {
    delete this.majors[major.getID()];
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

  /** 
  * Gets the actual grade of the course
  * @return int
  **/
  getActualGrade() {
    return this.actualGrade;
  }

  /**
  * Gets the anticipated grade of the course
  * @return int
  **/
  getAnticipatedGrade() {
    return this.anticipatedGrade;
  }

  /**
  * Gets the ID of the course
  * @return int
  **/
  getID() {
    return this.id;
  }

  /**
  * Gets the name of the course
  * @return string
  **/
  getName() {
    return this.name;
  }

  /**
  * Gets the current semester of the course
  * @return int
  **/
  getSemester() {
    return this.semester;
  }
  
  /**
  * Gets the dictionary of Majors
  * @return dictionary<int, Major>
  **/
  getMajors() {
    return this.majors;
  }

  /**
  * Converts the major dictionary to just a list of the IDs
  * @return list<int>
  **/
  getMajorIDList() {
    var majors = [];
    for (var major in this.majors) {
      major = this.majors[major];
      majors.push(major.getID());
    }
    return majors;
  }

  /**
  * Sets the number of credits the course is worth
  * @param credits[float]
  **/
  setCredits(credits) {
    this.credits = parseFloat(credits);
  }

  /**
  * Sets the name of the course
  * @param name[String]
  **/
  setName(name) {
    this.name = name.trim();
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
  
  //////////////////////////////////
  // Network

  /**
  * Sends a network request to delete the course
  * @param actionSuccess[function]
  **/
  deleteCurrentCourse(actionSuccess) {
    $.ajax({
      url: "/academic_manager/delete_course",
      contentType: "application/json",
      type: "DELETE",
      data: JSON.stringify(this),

      statusCode: {
        202: function(response) {
          actionSuccess(response);
        }
      },

      error: function(response) {
        //TODO: action on failure
        console.log("error deleting course");
      }
    });
  }


  //////////////////////
  //JSON stuff

  /**
  * Converts this course into JSON
  * @return dictionary (JSON)
  **/
  toJSON() {
    return {
      "id" : this.id, 
      "name" : this.name,
      "actual_grade" : this.actualGrade,
      "anticipated_grade" : this.anticipatedGrade,
      "semester" : this.semester,
      "credits" : this.credits,
      "majors" : this.getMajorIDList(),
    };
  }
}
