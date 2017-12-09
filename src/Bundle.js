/* @flow */
import colors from "colors/safe"
import minimist from "minimist"
import CommandCompilerPass from "./DependencyInjection/Compiler/CommandCompilerPass"
import type {CommandInterface} from "../interface"
import type {BundleInterface, InitializableBundleInterface} from "solfegejs-application/src/BundleInterface"
import type Application from "solfegejs-application"
import type Container from "solfegejs-dependency-injection/src/ServiceContainer/Container"
import type {ContainerConfiguratorBundleInterface} from "solfegejs-dependency-injection/interface"

/**
 * Console bundle
 */
export default class Bundle implements BundleInterface, InitializableBundleInterface, ContainerConfiguratorBundleInterface
{
    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {Application}   application     Solfege application
     */
    initialize(application:Application)
    {
        // Listen the application start
        application.on("start", this.onStart.bind(this));
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container       Service container
     */
    configureContainer(container:any):void
    {
        // Add the compiler pass that handle command tags
        container.addCompilerPass(new CommandCompilerPass());
    }

    /**
     * The application is started
     *
     * @param   {Application}   application     The application
     * @param   {Array}         parameters      The parameters
     */
    async onStart(application:Application, parameters:Array<string>)
    {
        const container:Container = application.getParameter("serviceContainer");
        if (!container) {
            throw new Error("Service container not available");
        }

        // Get commands
        let commands = [];
        try {
            let commandsRegistry = await container.get("solfege_console_commands_registry");
            commands = commandsRegistry.getCommands();
        } catch (error) {
            throw new Error(`[CLI] Unable to get commands: ${error.message}`);
        }

        // Split parameters and options
        let args = minimist(parameters);
        parameters = args._;
        let options = Object.assign({}, args);
        delete options._;


        // Configure commands
        // and create a map
        let commandMap = new Map;
        for (let command of commands) {
            // Check signature requirements
            if (typeof command.getName !== "function") {
                throw new Error(`Command must implement "getName" method.`);
            }

            if (typeof command.configure === "function") {
                await command.configure();
            }

            let name = command.getName();
            commandMap.set(name, command);
        }

        // Check if the user executes a command
        if (parameters.length > 0) {
            let commandName = parameters.shift();

            if (commandMap.has(commandName)) {
                let command = commandMap.get(commandName);

                // Execute the command
                let commandParameters = parameters.slice(0);
                if (command) {
                    await command.execute(commandParameters, options);
                }
                return;
            }
        }


        // Display the header
        let title = "SolfegeJS CLI";
        console.info(colors.bgBlack.cyan(title));
        console.info(colors.bgBlack.cyan("-".repeat(title.length))+"\n");

        // Display command list
        await this.displayAvailableCommands(commands);
    }

    /**
     * Display available commands
     *
     * @param   {Set}   commands    Commands
     */
    async displayAvailableCommands(commands:Set<CommandInterface>)
    {
        for (let command:CommandInterface of commands) {
            let name = command.getName();
            let description = "";

            // @todo Find a way to type the optional getDescription() method
            if (typeof command.getDescription === "function") {
                description = command.getDescription();
            }

            console.info(`${colors.green(name)}   ${description}`);
        }
    }
}
