var h1Plugin = new pluginManager('pluginDiv');
var currentTab = 0; // Current tab is set to be the first tab (0)

var cors_api_url = "https://cors-anywhere.herokuapp.com/"
var url = cors_api_url + "http://fingerveinrestapi-env.eba-yv7gqaek.us-east-1.elasticbeanstalk.com/"

$(document).ready(function (e){
    h1Plugin.pageLoaded();

    $(".alert").hide();
    $("#prevBtn").css("display", "none");

    showTab(currentTab); // Display the current tab
});

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = $(".tab")
    x[n].style.display = "block";
  
    if (n == (x.length - 1)) {
      $("#nextBtn").innerHTML = "Submit";
    } else {
     $("#nextBtn").innerHTML = "Proceed";
    }
  
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = $(".tab")

    if(currentTab == 0) {
        // Start enrollment process
        h1Plugin.authentication( authenticateSuccess, authenticatError );
        console.log("Authenticating")
    }
    else {
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
}

function showNextPrev(n) {
    // This function will figure out which tab to display
    var x = $(".tab")
  
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

function authenticateSuccess(enrollTemplate) {

    console.log("Authenticate Template:")
    console.log(enrollTemplate);

    if ((enrollTemplate.indexOf("Warning") != -1) || (enrollTemplate.indexOf("Error") != -1)) {
        displayAlert(enrollTemplate);
        return false;
    }

    if (enrollTemplate != null && enrollTemplate != "")
    {
        $.ajax({
            url: url + "authenticate",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
              fingertemplate: enrollTemplate,
            }),
            success: function(data) {
                console.log(data);
        
                // Set Data and show Results screen
                showNextPrev(1);
            },
            error: function(error) {
              console.log(error);
              showNextPrev(1);
            }
        });
    }
}

function authenticatError(errorInfo) {
    console.log("Error")
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

function displayAlert(msg) {
    $("#alert-text").text(msg);
    $(".alert").show();
  }
  