import solfege from "solfegejs";
import cli from "../../bundle-es5";

var application = new solfege.kernel.Application(__dirname);
application.addBundle('console', new cli.Console);

application.start();

