class Course {
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
  static loadCourseFromJSON(json) {
    return new Course(json["id"], json["name"], 
      json["credits"], json["semester"],
      json["actual_grade"], json["anticipated_grade"],
      json["majors"]);
  }

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

  addMajor(major) {
    this.majors[major.getID()] = major;
  }

  toggleMajor(major) {
    if (major.getID() in this.majors) {
      this.deleteMajor(major);
    } else {
      this.addMajor(major);
    }
  }

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

  getActualGrade() {
    return this.actualGrade;
  }

  getAnticipatedGrade() {
    return this.anticipatedGrade;
  }

  getID() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getSemester() {
    return this.semester;
  }
  
  getMajors() {
    return this.majors;
  }

  setCredits(credits) {
    this.credits = parseInt(credits);
  }

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
    deleteCurrentCourse(action) {
    $.ajax({
      url: "/academic_manager/delete_course",
      contentType: "application/json",
      type: "DELETE",
      data: JSON.stringify(this),

      statusCode: {
        202: function(response) {
          action(response);
          console.log("sucessfully deleted course");
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
  getMajorIDList() {
    var majors = [];
    for (var major in this.majors) {
      major = this.majors[major];
      majors.push(major.getID());
    }
    return majors;
  }

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
