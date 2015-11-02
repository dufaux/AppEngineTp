package fil.iagl.appengine.form;

/**
 * Represente le formulaire de profile cote client.
 *
 */
public class AnnonceForm {
	
	private String name;
	private String description;
	
	public AnnonceForm(String name, String description) {
		this.name = name;
		this.description = description;
	}
	// constructeur vide obligatoire
	public AnnonceForm(){
		this.name = "Unknow";
		this.description = "Unknow";
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
	
	
	
}
