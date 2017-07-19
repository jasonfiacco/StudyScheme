class User {
  constructor(id, creditsNeeded) {
    this.id = id;
    this.creditsNeeded = creditsNeeded;
    this.courses = [];
    this.majors = [];
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
    return Math.max(creditsNeeded - this.creditsTaken(), 0)
  }

  addMajor(major) {
    this.majors.push(major);
  }

  addCourse(course) {
    this.courses.push(course);
  }

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

  anticipatedGPA() {
    var weightedTotal = 0;
    for (var course in this.courses) {
      course = this.courses[course];
      if (course.completed()) {
        weightedTotal += course.getCredits() * course.getActualGrade();
      } 
      else if (course.anticipated()) {
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
  highestGPA() {
    var weightedTotal = 0;
    weightedTotal += this.currentGPA() * this.creditsTaken();
    weightedTotal += 4.0 * this.creditsRemaining();
    return getGPA(weightedTotal / this.creditsNeeded);
  }

  /////////////////////////
  // Getters and Setters
  getCreditsNeeded() {
    return this.creditsNeeded;
  }

  getMajors() {
    return this.majors;
  }

  getMajorIDList() {
    var ids = []
    for (var major in this.majors) {
      major = this.majors[major];
      ids.push(major.getID());
    }
    return ids;
  }

  setCreditsNeeded(credits) {
    this.creditsNeeded = credits;
  }
  /////////////////////////

  //JSON stuff
  toJSON() {
    return {
      "id" : this.id,
      "creditsNeeded" : this.creditsNeeded,
      "courses" : this.courses,
      "majors" : this.majors
    }
  }
}
