import solfege from "solfegejs"
import CliBundle from "../../lib/Bundle"
//import MyBundle from "./Bundle";

// Create application instance
let application = new solfege.Application;
application.addBundle(new CliBundle);

// Load configuration file
//application.loadConfigurationFile(`${__dirname}/config/production.yml`, "yaml");

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
