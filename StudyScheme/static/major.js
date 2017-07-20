class Major {
  constructor(id, name, creditsNeeded) {
    this.id = id;
    this.name = name.trim();
    this.creditsNeeded = creditsNeeded;
    this.courses = []
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

  setCreditsNeeded(credits) {
    this.creditsNeeded = parseInt(credits);
  }

  setName(name) {
    this.name = name.trim();
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
