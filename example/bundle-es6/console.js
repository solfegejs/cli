import solfege from "solfegejs";
import cli from "../../bundle";
import MyBundle from "./MyBundle";

var application = new solfege.kernel.Application(__dirname);
application.addBundle('console', new cli.Console);
application.addBundle('foo', new MyBundle);

application.overrideConfiguration({
    console: {
        title: "Hello CLI"
    }
});

application.start();

