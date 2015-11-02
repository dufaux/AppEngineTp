package fil.iagl.appengine.domain;

public class Profile {
	
	private String userId;
	private String name;
	private String email;
	private String city;
	
	
	public Profile(String userId, String name, String email, String city){
		this.userId = userId;
		this.name = name;
		this.email = email;
		this.city = city;
	}
	
	public String getUserId(){
		return userId;
	}
	
	public String getName(){
		return name;
	}
	
	public String getEmail(){
		return email;
	}

	public String getCity(){
		return city;
	}
}
