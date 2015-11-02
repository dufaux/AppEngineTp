package fil.iagl.appengine.exception;

/**
 * Represente le formulaire de profile cote client.
 *
 */
public class badrequest extends Exception{
	
	public badrequest() {
		super("Requête non autorisé.");
	}
}
