var pluginManager = function() {
  var mimetype = "application/x-fviescannerplugin"
  var plugin = null;

  this.pluginLoaded = function() {
		plugin = this.getPlugin();
  };
  
  this.pageLoaded = function(){

    var parser = new UAParser();
    var browser = parser.getBrowser().name
    var browserVersion = parser.getBrowser().version

		switch(browser)
		{
			case "Chrome":
				if(browserVersion < 62)
					alert("The scanner plug-in requires Chrome version:62 or above.");
				else
					initPlugin();
				break;
			case "IE":
        initializeActiveXOrNPAPIPlugin();
				break;
			case "Firefox":
				if(browserVersion < 52)
					initializeActiveXOrNPAPIPlugin();
				else
					initPlugin();

				break;
		}
  };

  this.getPlugin = function () {
		if(plugin != null)
		{
			return plugin;
		}
		else
		{
			plugin = document.getElementById("h1FvPlugin");
			return plugin;
		}
  };
  
  this.enrollCapturedTemplate = function ( successCallback, errorCallback ) {

    var finger = "1", timeout = 20000, showPrompt = true;
    var pluginInstance = this.getPlugin();

		pluginInstance.getEnrolmentTemplate(finger, timeout, showPrompt).then(
		
		  function(fvTemplate) {

				if(isSuccess(fvTemplate)) {
          if(successCallback)
						successCallback(fvTemplate);
				}
				else {
          if(errorCallback)
						errorCallback(fvTemplate, "Capture");
				}
			},
			
			function(errorInfo) {
        if(errorCallback)
          errorCallback(errorInfo, "Capture");
			}
		);
  }

  this.verifyEnrollment = function( successCallback, errorCallback ) {
    
    var finger = "1", timeout = 20000, threshold= 1000, showPrompt = true;
    var pluginInstance = this.getPlugin();

		pluginInstance.verifyAfterEnrol(finger, timeout, threshold, showPrompt).then(
		
      function(fvTemplate) {
        
        if(isSuccess(fvTemplate))
				{
					if(successCallback)
						successCallback(fvTemplate);
				}
				else
				{
					if(errorCallback)
						errorCallback(fvTemplate, "Verify");
				}
			},
			
			function(errorInfo) {
        if(errorCallback)
          errorCallback(errorInfo, "Verify");
			}
		);
  }

  this.authentication = function( successCallback, errorCallback ) {
    var finger = "1", timeout = 20000, showPrompt = true;
    var pluginInstance = this.getPlugin();

		pluginInstance.getVerificationTemplate(finger, timeout, showPrompt).then(
		
      function(fvTemplate) {
        if(isSuccess(fvTemplate))
				{
					if(successCallback)
						successCallback(fvTemplate);
				}
				else
				{
					if(errorCallback)
						errorCallback(errorCallback);
				}
      },
			function(errorInfo){
        errorCallback(errorInfo);
			}
		);

  }

  function initPlugin() {
    //Create a var that basically saves a random number to guarantee an unique identifier for a function. _plugin_ can be any other name.
    var callbackFn = "_plugin_" + Math.floor(Math.random() * 100000000);
  
    window[callbackFn] = function (data) {
      //Retrieve the wyrmhole factory for later creation
      var helper = data.wyrmhole;
  
      setHelper(helper);
    }
    /*Post a message to the extension, telling it to instantiate a a wyrmhole.
    FBDevTeam should be the name of your company inside the plugin configuration. For the echoTestPlugin its FBDevTeam.
    callbackFn is the function that will be called once the result of the postMessage is returned.
    */
    window.postMessage({firebreath: 'hitachi', callback: callbackFn}, "*");
  }

  function initializeActiveXOrNPAPIPlugin() {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = "function pluginLoaded() { h1Plugin.pluginLoaded(); }";
		document.head.appendChild(script);
		document.getElementById("pluginDiv").innerHTML = pluginTag;
	}
  
  function setHelper(helper) {
    //Using the wyrmholeFactory we create a wyrmhole.
    helper.create(mimetype).then(
        function (wyrmhole) {
          //With the created wyrmhole we instantiate a new FireWyrmJS object that will allow us to create the plugin.
          var FWJS = window.FireWyrmJS;
          //Create pluginFactory that will allow the plugin creation.
          window.pluginFactory = new FWJS(wyrmhole);
        pluginFactory.create(mimetype, {/*some params*/}).then(
          function (pluginObj) {
            //Save the plugin to a gloal var for later access
            plugin = pluginObj;
            console.log("Wyrmhole created");
          },
          function (error) {
            console.log("An Unexpected Error has ocurred: ", error);
          })
        },
        function (error) {
          console.log("An Unexpected Error has ocurred: ", error);
        }
      )
  }

  function getPluginVersion() {
    var pluginInstance = this.getPlugin();
		pluginInstance.version.then(
			function(versionInfo) {
				console.log("Plugin Version Is: ", versionInfo);
			},
			function(errorInfo) {
				console.log("An Unexpected Error has ocurred: ", errorInfo);
			}
		);
  }

  function getAppName() {
    var pluginInstance = this.getPlugin();
    pluginInstance.getAppName().then(
      function(appName) {
        console.log("Application Name: ", appName);
      },
        
      function(errorInfo){
        console.log("An Unexpected Error has ocurred: ", errorInfo);
      }
		);
  }
  
  function getUserSID() {
    var pluginInstance = this.getPlugin();
		pluginInstance.getUserSID().then(
      function(userSID){
        console.log("User ID: ", userSID);
      },
			
			function(errorInfo) {
				console.log("An Unexpected Error has ocurred: ", errorInfo);
			}
		);
  }

  var isSuccess = function(resultStr)
	{
		var isSuccessResponse = true;
		var response = resultStr.trim();
		
		if(!response || response.length === 0)
			isSuccessResponse = false;
		else if(response.toUpperCase().lastIndexOf("Error".toUpperCase()) === 0)
			isSuccessResponse = false;
		else if(response.toUpperCase().lastIndexOf("Warning".toUpperCase()) === 0)
			isSuccessResponse = false;
		else
			isSuccessResponse = true;
		
		return isSuccessResponse;
  };
  
};





  