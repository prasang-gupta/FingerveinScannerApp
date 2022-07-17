
var h1Plugin = new pluginManager('pluginDiv');
var currentTab = 0; // Current tab is set to be the first tab (0)

var cors_api_url = "https://cors-anywhere.herokuapp.com/"
var url = cors_api_url + "http://fingerveinrestapi-env.eba-yv7gqaek.us-east-1.elasticbeanstalk.com/"

$(document).ready(function (e){
    h1Plugin.pageLoaded();

    $(".alert").hide();

    showTab(currentTab); // Display the current tab
   
    $("#accept-checkbox").click(function() {
        if(this.checked) {
          toggleButtonState('#nextBtn', false);
        }
        else {
          toggleButtonState('#nextBtn', true);
        }
    });

});

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = $(".tab")
  x[n].style.display = "block";

  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    $("#prevBtn").css("display", "none");
  } else {
    $("#prevBtn").css("display", "inline");
  }

  if (n == (x.length - 1)) {
    $("#nextBtn").innerHTML = "Submit";
  } else {
   $("#nextBtn").innerHTML = "Next";
  }

  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {

  // Disable Next button until terms have been accepted
  if( currentTab == 0) {
    toggleButtonState('#nextBtn', true);
  }

  if(currentTab == 2) {
    // Verify user is not already enrolled
    checkUserExits(n);
  }
  else if( currentTab == 4 ) {
    // Start enrollment process
    toggleButtonState('#nextBtn', true);
    h1Plugin.enrollCapturedTemplate( captureTemplateSuccess, scanError );
    console.log("Enrolling")
  }
  else {
    showNextPrev(n);
  }
    
}

function showNextPrev(n) {
  // This function will figure out which tab to display
  var x = $(".tab")

  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;

  // Hide the current tab:
  x[currentTab].style.display = "none";

  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;

  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("enrollForm").submit();
    return false;
  }

  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function checkUserExits(n) {
  $.ajax({
    url: url + "checkexists",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      email: $('#email').val()
    }),
    success: function(data) {
      console.log(data);

      if(data.statuscode == -1) {
        showNextPrev(n);
      }
      else {
        displayAlert("User Already Exists.");
      }
    },
    error: function(error) {
      console.log(error);
      displayAlert("User Already Exists.");
    }
  });
}

function enrollUserData() {
  $.ajax({
    url: url + "enroll",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      first: $('#first').val(),
      last: $('#last').val(),
      email: $('#email').val(),
      fingertemplate: $('#hdnFinger1').val(),
      fingerverificationtemplate: $('#hdnVerifyFinger1').val()
    }),
    success: function(data) {
      console.log(data);

      if(success == 200) {
        showNextPrev(1);
      }
    },
    error: function(error) {
      console.log(error);
      showNextPrev(1);
    }
  });
}

function captureTemplateSuccess(enrollTemplate) {

  if (enrollTemplate.indexOf("Warning") != -1) {
    $("#alert-text").text(enrollTemplate);
    return false;
  }

  console.log("Enroll Template:")
  console.log(enrollTemplate)
  $("#hdnFinger1").val(enrollTemplate);

  h1Plugin.verifyEnrollment( verifyTemplateSuccess, scanError );
}

function verifyTemplateSuccess(verifyAfterTemplate) {
  if (verifyAfterTemplate.indexOf("Warning") != -1) {
    alertError(verifyAfterTemplate);
    return false;
  }

  console.log("Verify Template:")
  console.log(verifyAfterTemplate);
  $("#hdnVerifyFinger1").val(verifyAfterTemplate);
  enrollUserData();
}

function scanError(errorInfo, option) {
  console.log(option + ": " + errorInfo);
  $("#alert-text").text(option + ": " + errorInfo);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

function toggleButtonState(button, disabled) {
  if(disabled){
    $(button).attr('disabled', true); //disable input
    $(button).css('background-color', "#bbbbbb"); //disable input
    $(button).css('cursor', "pointer"); //disable input
  }
  else {
    $(button).attr('disabled', false); //disable input
    $(button).css('background-color', "#4CAF50"); //disable input
    $(button).css('cursor', "pointer"); //disable input
  }
}

function displayAlert(msg) {
  $("#alert-text").text(msg);
  $(".alert").show();
}


