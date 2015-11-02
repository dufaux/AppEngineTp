package fil.iagl.appengine.form;

/**
 * Represente le formulaire de profile cote client.
 *
 */
public class ProfileForm {
	
	private String name;
	private String city;
	
	public ProfileForm(){
		this.name = null;
		this.city = "Unknown";
	}
	public ProfileForm(String name, String city){
		this.name = name;
		this.city = city;
	}
	
	public String getName(){
		return this.name;
	}
	
	public String getCity(){
		return this.city;
	}
}
