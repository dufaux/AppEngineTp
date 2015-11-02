package fil.iagl.appengine.domain;

public class Annonce {
	private String userId;
	private String name;
	private String description;
	private Profile profile;
	
	public Annonce(String userId, String name, String description) {
		super();
		this.userId = userId;
		this.name = name;
		this.description = description;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public Profile getProfile(){
		return profile;
	}
	
	public void setProfile(Profile profile){
		this.profile = profile;
	}
	
}
