import Application from "solfegejs-application"
import DIBundle from "solfegejs-dependency-injection"
import CliBundle from "../../lib/Bundle"
//import MyBundle from "./Bundle";

// Create application instance
let application = new Application;
application.addBundle(new DIBundle);
application.addBundle(new CliBundle);

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
