function creditsCompleted() {
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

$(function() {
  $("#credits_needed").change(function(){
    $("#credits_remaining").text(parseInt($("#credits_needed").val()) - creditsCompleted());
  });
});
