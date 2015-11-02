/*
 * Parameters
 */

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
var signedIn = false;
var profile = false;
var CLIENT_ID = 
    '235877908208-4hk9bci3c430g5jn0vs7ip67vkpug18m.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
var SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';




/*
 * Functions 
 */


/**
 * Loads the application UI after the user has completed auth.
 */
userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      signedIn = true;
      $('#login_url').html('Sign out');
      try{
    	  console.log('chargement du profile');
          getProfile();
      }
      catch(err){
    	  profile = false;
    	  console.log('pas de profil à charger');
      }
    }
    else {
    	$('#login_url').html('Sign in');
    }
  });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
signin = function(mode, callback) {
	gapi.auth.authorize({client_id : CLIENT_ID,
				       scope     : SCOPES, 
				       immediate : mode},
				      callback);
};

/**
 * Presents the user with the authorization popup.
 */
auth = function() {
  if (!signedIn) {
	signedIn = true;
    signin(false, userAuthed);
  } else {
    signedIn = false;
    $('#login_url').html('Sign in');
  }
};

saveProfile = function (city,name) {
	if(!signedIn) {
		alert("veuillez autoriser l'application pour continuer");
		return;
	}
	gapi.client.annonce.saveProfile({ "city" : city , "name" : name}).execute(function (resp){
		 if(!resp.code){
			 $('#save_profile_container').hide(200);
			 $('#saved_profile_container').show(200);
			 profile = true;
		 }else {
			 $('#save_profile_container').show(200);
			 alert("can't save profile");
		 }
	 });
}

addAnnonce = function (name,description) {
	if(!profile) {
		alert("Veuillez vous identifier avant d'ajouter une annonce");
		$(location).attr('href', window.location.host + "/index.html");
		return;
	} 
	
	gapi.client.annonce.addAnnonce( {"name" : name , "description" : description}).execute(function (resp){
		if(!resp.code){
			alert("félicitation votre annonce est bien ajoutée");
		}else{
			alert("can't add Annonce");
		}
	});
}

getProfile = function() {
	  console.log("getProfile");
	  try{
		  gapi.client.annonce.getProfile().execute(
		      function(resp) {
		        if (!resp.code) {
		        	$('#designation').html(resp.name + " de " +resp.city);
		        	profile = true;
		        	console.log("cas1");
		          
		        } else {
		        	profile = false;
		        	console.log("cas2");
		        }
		      },function() {
		    	  profile = false;
		    	  console.log("cas3");
		      });  
	  }catch(err){
		  profile = false;
	  }
	};

/*
 * Events
 */


/**
 * Enables the button callbacks in the UI.
 */
enableButtons = function() {
  $('#login_url').on('click',function() {
    auth();
  });
  
  $('#btn_add').on('click',function() {
	  var name = $("#input_name").val();
	  var description = $("#input_description").val();
	  addAnnonce(name,description);
  });
  
  $('#btn_save_profile').on('click', function () {
	  var city = $("#input_city").val();
	  var name = $("#input_name").val();
	  saveProfile(city,name);
  });
};


/*
 * App
 */

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
init = function() {
	gapi.client.load('annonce', 'v1', function(){}, '//' + window.location.host + '/_ah/api');
	gapi.client.load('oauth2', 'v2', initialisation);
	
	function initialisation() {
		gapi.auth.authorize({client_id : CLIENT_ID,
		       scope     : SCOPES, 
		       immediate : true},
		      function(){});
		run();
	}
};

run = function() {}
