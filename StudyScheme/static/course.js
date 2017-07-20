class Course {
  constructor(id, name, credits, semester) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.semester = semester;
    this.majors = [];
    this.actualGrade = -1;
    this.anticipatedGrade = -1;
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

  setCredits(credits) {
    this.credits = parseInt(credits);
  }

  setName(name) {
    this.name = name;
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
  //////////////////////

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
      "majors" : this.getMajorIDList(),
    };
  }
}
