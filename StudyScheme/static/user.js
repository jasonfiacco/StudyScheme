class User {
  constructor(id, creditsNeeded) {
    this.id = id;
    this.creditsNeeded = creditsNeeded;
    this.courses = {};
    this.majors = {};
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

  anticipatedCreditsTaken() {
    var credits = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed() || course.anticipated()) {
        credits += course.getCredits();
      }
    }
    return credits;
  }

  creditsRemaining() {
    return Math.max(this.creditsNeeded - this.creditsTaken(), 0)
  }

  addMajor(major) {
    this.majors[major.getID()] = major;
  }

  addCourse(course) {
    this.courses[course.getID()] = course;
  }

  currentGPA(maxSemester) {
    var weightedTotal = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed()) {
        weightedTotal += course.getCredits() * course.getActualGrade();
      }
    }
    return getGPA(weightedTotal / this.creditsTaken());
  }

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
    return getGPA(weightedTotal / this.anticipatedCreditsTaken());    
  }

  /**
  * Calculates the highest GPA of user assuming they only take
  * as many credits as needed
  * @return double of highest grade user can obtain
  **/
  highestGPA(maxSemester) {
    var weightedTotal = 0;
    weightedTotal += this.currentGPA() * this.creditsTaken();
    var semestersLeft = Math.max(maxSemester - this.getCompletedSemester(), 1);
    weightedTotal += 4.0 * Math.max(this.creditsRemaining() / semestersLeft, 0);
    return getGPA(weightedTotal / this.creditsNeeded);
  }

  /////////////////////////
  // Getters and Setters
  /**
  * Gets the max of the semesters of the courses completed
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
  /////////////////////////

  //JSON stuff
  toJSON() {
    return {
      "id" : this.id,
      "creditsNeeded" : this.creditsNeeded,
      "courses" : this.getCoursesList(),
      "majors" : this.getMajorsList()
    }
  }
}
