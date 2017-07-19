$(function() {
  function creditsCompleted() {
  return 0;
  }

  function majorCreditsCompleted(majorID) {
    return 0;
  }

  function actualAverageGPA() {
    return 0;
  }

  function anticipatedAverageGPA() {
    return 0;
  }

  function highestPossibleGPA() {
    return 0;
  }

  function majorGPA(majorID) {
    return 4.0;
  }

  function addMajor(id, major, creditsNeeded) {
    var row = document.createElement("tr");
    row.id = "major-" + id;
    var majorData = document.createElement("td";
    majorData.text = major;

    var creditsData = document.createElement("td");
    var creditsEntry = $("<input type='text'></input>").val(creditsNeeded);
    creditsEntry.id = "creditsNeeded-" + id;
    creditsData.append(creditsEntry);


    var creditsRemainingData = document.createElement("td");
    creditsRemainingData.id = "creditsRemaining-" + id;
    creditsRemainingData.text = creditsNeeded;

    var majorGPAData = document.createElement("td");
    majorGPAData.id = "majorGPA-" + id;
    majorGPAData.text = majorGPA(id).toFixed(2);


    row.after(majorData, creditsData, creditsRemainingData, majorGPAData);
    $("#intended_majors").append(row);
  }


  $("#credits_needed").change(function(){
    $("#credits_remaining").text(parseInt($("#credits_needed").val()) - creditsCompleted());
  });
});
