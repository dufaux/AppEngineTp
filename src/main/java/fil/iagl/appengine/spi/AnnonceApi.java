package fil.iagl.appengine.spi;

import java.util.ArrayList;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.User;

import fil.iagl.appengine.Constants;
import fil.iagl.appengine.domain.Annonce;
import fil.iagl.appengine.domain.Profile;
import fil.iagl.appengine.form.AnnonceForm;
import fil.iagl.appengine.form.ProfileForm;

@Api(name ="annonce", 
	version="v1", 
	clientIds= {Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
	description= "API pour le tp 'annonce' IAGL 2015")
public class AnnonceApi {

	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	private static String extractNameFromEmail(String email){
		return email == null ? null : email.substring(0, email.indexOf("@"));
	}
	
	private static void CheckUser(User user) throws UnauthorizedException{
		if(user == null){
			throw new UnauthorizedException("Veuillez vous identifier");
		}
	}
	
	
	/* GESTION DU PROFIL */
	
	
	@ApiMethod(name = "saveProfile", path = "profile", httpMethod = HttpMethod.POST)
	public Profile saveProfile(final User user, ProfileForm profileForm) throws UnauthorizedException{
		CheckUser(user);
		
		String city = profileForm.getCity();
		String name = profileForm.getName();
		String email = user.getEmail();
		String userId = user.getUserId();
		if(name == null){
			name = extractNameFromEmail(email);
		}
		
		Profile profile = new Profile(userId,name,email,city);
		
		//TO DO
		// Save the profile in datastore
		Key profileKey = KeyFactory.createKey("Profile", userId);
		Entity profileStored = new Entity("Profile",profileKey.getName());
		profileStored.setProperty("userId", userId);
		profileStored.setProperty("email", email);
		profileStored.setProperty("name", name);
		profileStored.setProperty("city", city);
		
		datastore.put(profileStored);
		
		return profile;
	}
	
	@ApiMethod(name = "getProfile", path="profile", httpMethod = HttpMethod.GET)
	public Profile getProfile(final User user) throws UnauthorizedException{
		CheckUser(user);
		
		Profile profile = null;
		Key profileKey = KeyFactory.createKey("Profile",user.getUserId());
		Entity profileStored;
		try {
			profileStored = datastore.get(profileKey);
			String userId = (String) profileStored.getProperty("userId");
			String email = (String) profileStored.getProperty("email");
			String name = (String) profileStored.getProperty("name");
			String city = (String) profileStored.getProperty("city");
			
			profile = new Profile(userId,name,email,city);
		} catch (EntityNotFoundException e) {
			
			e.printStackTrace();
		}
		return profile;
	}
	
/* GESTION DES ANNONCES */
	
	@ApiMethod(name = "addAnnonce", path="addAnnonce", httpMethod = HttpMethod.POST)
	public Annonce addAnnonce(final User user,AnnonceForm new_annonce) throws UnauthorizedException{
		CheckUser(user);
		Annonce annonce = new Annonce(user.getUserId(),new_annonce.getName(),new_annonce.getDescription());
		
		Key profileKey = KeyFactory.createKey("Profile",user.getUserId());
		Entity profileStored;
		try {
			profileStored = datastore.get(profileKey);
			
			Entity annonceStored = new Entity("Annonce",new_annonce.getName(),profileStored.getKey());
			annonceStored.setProperty("userId", annonce.getUserId());
			annonceStored.setProperty("name", annonce.getName());
			annonceStored.setProperty("description", annonce.getDescription());
			datastore.put(annonceStored);
			
			
		}catch (EntityNotFoundException e) {
			e.printStackTrace();
		}
		return annonce;
	}
	
	@ApiMethod(name = "getAnnonces", path="getAnnonces", httpMethod = HttpMethod.GET)
	public ArrayList<Annonce> getAnnonces(){
		Query q = new Query("Annonce");
		PreparedQuery pq = datastore.prepare(q);
		ArrayList<Annonce> annonces = new ArrayList<Annonce>();
		for (Entity r : pq.asIterable()) {
			Annonce an = new Annonce((String) r.getProperty("userId"),
					(String) r.getProperty("name"),
					(String) r.getProperty("description"));
			try {
				Key profileKey = KeyFactory.createKey("Profile",(String) r.getProperty("userId"));
				Entity profileStored;
				profileStored = datastore.get(profileKey);
				String userId = (String) profileStored.getProperty("userId");
				String email = (String) profileStored.getProperty("email");
				String name = (String) profileStored.getProperty("name");
				String city = (String) profileStored.getProperty("city");
				an.setProfile( new Profile(userId,name,email,city));
			}catch (EntityNotFoundException e) {
				an.setProfile( new Profile("unknow","unknow","unknow","unknow"));
			}
			annonces.add(an);
		}
		return annonces;

	}
}
