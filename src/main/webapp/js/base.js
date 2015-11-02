
/**
 * @fileoverview
 * Provides methods for the annonce Endpoints sample UI and interaction with the
 * annonce Endpoints API.
 *
 * @author danielholevoet@google.com (Dan Holevoet)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** fil namespace for Google Developer Relations projects. */
google.fil = google.fil || {};

/** appengine namespace for fil sample code. */
google.fil.appengine = google.fil.appengine || {};

/** annonce namespace for this sample. */
google.fil.appengine.annonce = google.fil.appengine.annonce || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
google.fil.appengine.annonce.CLIENT_ID = 
    '309320613483-uvsj2pmtkjj25ukelo5vuadrmqe12as4.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
google.fil.appengine.annonce.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.fil.appengine.annonce.signedIn = false;
google.fil.appengine.annonce.username = "";
google.fil.appengine.annonce.city = "";
/**
 * Loads the application UI after the user has completed auth.
 */
google.fil.appengine.annonce.userAuthed = function() {
  console.log("google.fil.appengine.annonce.userAuthed");
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      google.fil.appengine.annonce.signedIn = true;
      google.fil.appengine.annonce.displayLogged();
      //document.getElementById('authedGreeting').disabled = false;
      
      // si pas de profile, on en crée un par defaut et le recupere.
          var si_profile_inexistant = function(){
        	  google.fil.appengine.annonce.saveProfile(null,null,google.fil.appengine.annonce.getProfile());
          }
          google.fil.appengine.annonce.getProfile(si_profile_inexistant);
    }
  });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
google.fil.appengine.annonce.signin = function(mode, callback) {
  gapi.auth.authorize({client_id : google.fil.appengine.annonce.CLIENT_ID,
				       scope     : google.fil.appengine.annonce.SCOPES, 
				       immediate : mode},
				      callback);
};

/**
 * Presents the user with the authorization popup.
 */
google.fil.appengine.annonce.auth = function() {
  if (!google.fil.appengine.annonce.signedIn) {
    google.fil.appengine.annonce.signin(false, google.fil.appengine.annonce.userAuthed);
  } else {
    google.fil.appengine.annonce.signedIn = false;
    google.fil.appengine.annonce.displayLogged();
    //window.location.reload();
    //document.getElementById('authedGreeting').disabled = true;
  }
};


/*
 * */
google.fil.appengine.annonce.saveProfile = function(name, city, callback) {
console.log("google.fil.appengine.annonce.saveProfile");
gapi.client.annonce.saveProfile({'name' : name, 'city' : city}).execute(
  function(resp) {
    if (!resp.code) {
      if(typeof callback == "function"){
 		 $('#save_profile_container').hide(200).delay(1000).show(200);
		 $('#saved_profile_container').show(200).delay(1000).hide(200);
		 google.fil.appengine.annonce.username = name;
		 google.fil.appengine.annonce.city = city;
    	 callback();
	  }
    } else {
	  $('#save_profile_container').show(200);
      window.alert(resp.message);
    }

  });
};

/**
 * Gets a numbered greeting via the API.
 * @param {string} id ID of the greeting.
 */
google.fil.appengine.annonce.getProfile = function(callback) {
  console.log("google.fil.appengine.annonce.getProfile");
  try{
	  gapi.client.annonce.getProfile().execute(
	      function(resp) {
	        if (!resp.code) {
	          //Si pas de userId alors pas de profile.
	          if(! resp.userId){
	        	  if(typeof callback == "function"){
		        	  callback();
	        	  }
	          }
	          // On rempli le profile
	          document.getElementById("input_name").value = resp.name;
	          document.getElementById("input_city").value = resp.city;
	          google.fil.appengine.annonce.username = resp.name;
	          google.fil.appengine.annonce.city = resp.city;
	          
	        } else {
	        	window.alert(resp.message);
	        }
	      });  
  }catch(err){
	  throw "Pas de profile";
  }
};


google.fil.appengine.annonce.postAnnonce = function(name, description, callback) {
	console.log("google.fil.appengine.annonce.postAnnonce");
	gapi.client.annonce.addAnnonce({'name' : name, 'description' : description}).execute(
	  function(resp) {
	    if (!resp.code) {
	      if(typeof callback == "function"){
	    	  callback();
		  }
	    } else {
	      window.alert(resp.message);
	    }
	  });
}


/**
 * Lists greetings via the API.
 */
google.fil.appengine.annonce.listAnnonce = function() {
  gapi.client.annonce.getAnnonces().execute(
      function(resp) {
        if (!resp.code) {
          resp.items = resp.items || [];
          for (var i = 0; i < resp.items.length; i++) {
            google.fil.appengine.annonce.addAnnonceDisplay(resp.items[i].name,resp.items[i].description,resp.items[i].profile.name,resp.items[i].profile.city);
          }
        }
      });
};



google.fil.appengine.annonce.displayLogged = function(){
	if(google.fil.appengine.annonce.signedIn){
		document.getElementById('signinButton').innerHTML = 'Sign out';
	    document.getElementById('save_profile_container').style.visibility = 'visible';
	    document.getElementById('post_annonce_container').style.visibility = 'visible';
	}
	else{
		document.getElementById('signinButton').innerHTML = 'Sign in';
	    document.getElementById('save_profile_container').style.visibility = 'hidden';
	    document.getElementById('post_annonce_container').style.visibility = 'hidden';
	}
}

google.fil.appengine.annonce.addAnnonceDisplay = function(title, description, name, ville){
	var template = '<div class=" form-group" style="border-top: 1px dashed black;  text-align: center;"> \
	    <h2>{{title}}</h2> \
        <div class="" style="border: 1px solid black; padding: 5px; padding-bottom: 25px;"> \
            <p> {{description}} </p> \
            <span style="float:right;"> {{name}}</span>\
			<span style="float:left;"> {{ville}}</span>\
        </div> \
	</div>'
	
	template = template.replace("{{title}}",title);
	template = template.replace("{{description}}",description);
	template = template.replace("{{name}}",name);
	template = template.replace("{{ville}}",ville);
	var div = document.createElement('div');
	div.innerHTML = template;
	
	//ajoute l'annonce à la page.
	var liste_annonce = document.getElementById("liste_annonce");
	liste_annonce.appendChild(div.firstChild);
}



/**
 * Enables the button callbacks in the UI.
 */
google.fil.appengine.annonce.enableButtons = function() {

  document.getElementById('btn_add').onclick = function() {
	var input_name = document.getElementById('input_name_annonce');
	var input_description = document.getElementById('input_description_annonce');
	
	google.fil.appengine.annonce.postAnnonce(input_name.value,input_description.value);
	google.fil.appengine.annonce.addAnnonceDisplay(input_name.value, input_description.value, google.fil.appengine.annonce.username, google.fil.appengine.annonce.city);
	
	input_name.value = "";
	input_description.value = "";
  
  }
  
  document.getElementById('btn_save_profile').onclick = function() {
		var input_name = document.getElementById('input_name');
		var input_city = document.getElementById('input_city');
		var confirme = function(){
			//alert("profile correctement modifié");
		}
		google.fil.appengine.annonce.saveProfile(input_name.value,input_city.value,confirme);  
  }
  
  document.getElementById('signinButton').onclick = function() {
    google.fil.appengine.annonce.auth();
  }
};



/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
google.fil.appengine.annonce.init = function(apiRoot) {
  // Loads the OAuth and annonce APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      google.fil.appengine.annonce.enableButtons();
      google.fil.appengine.annonce.listAnnonce();
      google.fil.appengine.annonce.signin(true,google.fil.appengine.annonce.userAuthed);
      document.getElementById("loader").style.visibility = "hidden";
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('annonce', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};
