import solfege from "solfegejs";
import colors from "colors";
import minimist from "minimist";

/**
 * The command line interface of SolfegeJS
 *
 * @class solfege.bundle.cli.Console
 */
export default class Console
{
    /**
     * Constructor
     */
    constructor()
    {
        // Initialize the configuration
        this._configuration = require(__dirname + "/../config/default");

        // Initialize the bundle list
        this._bundles = {};

        // Initialize the command list
        this._commands = {};
    }

    /**
     * The application instance
     *
     * @public
     * @member  {solfege.kernel.Application}
     */
    get application()
    {
        return this._application;
    }

    /**
     * The configuration
     *
     * @public
     * @member  {Object}
     */
    get configuration()
    {
        return this._configuration;
    }

    /**
     * The bundle list
     *
     * @public
     * @member  {Object}
     */
    get bundles()
    {
        return this._bundles;
    }

    /**
     * The command list per bundle
     *
     * @public
     * @member  {Object}
     */
    get commands()
    {
        return this._commands;
    }

    /**
     * Set the application
     *
     * @public
     * @param   {solfege.kernel.Application}    application     Application instance
     */
    *setApplication(application)
    {
        this._application = application;

        // Set listeners
        var bindGenerator = solfege.util.Function.bindGenerator;
        this._application.on(solfege.kernel.Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
        this._application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
    }

    /**
     * Override the configuration of the bundles
     *
     * @public
     * @param   {Object}    configuration   The configuration object
     */
    *overrideConfiguration(configuration)
    {
        this._configuration = configuration;
    }


    /**
     * Write in the standard output
     *
     * @public
     * @param   {string}    message             The message
     * @param   {integer}   level               The verbose level
     * @param   {string}    foregroundColor     The foreground color
     * @param   {string}    backgroundColor     The background color
     */
    output(message, level, foregroundColor, backgroundColor)
    {
        var options = minimist(process.argv.slice(2));

        // Get levels
        var maxLevel = 0;
        if (options.v) {
            maxLevel = 1;
        }
        if (options.vv) {
            maxLevel = 2;
        }
        if (options.vvv) {
            maxLevel = 3;
        }
        if (!level) {
            level = 0;
        }

        // Text colors
        if (foregroundColor && colors.styles.hasOwnProperty(foregroundColor)) {
            message = message[foregroundColor];
        }
        if (backgroundColor && colors.styles.hasOwnProperty(backgroundColor + 'BG')) {
            message = message[backgroundColor + 'BG'];
        }

        // Output the message
        if (level <= maxLevel) {
            console.info(message);
        }
    }

    /**
     * Executed when the bundles of the application are initialized
     */
    *onBundlesInitialized()
    {
        this._bundles = this.application.getBundles();

        // Get the available commands of each bundle
        for (var bundleId in this._bundles) {
            var bundle = this._bundles[bundleId];

            // Get the configuration of the bundle
            if (typeof bundle.getConfiguration !== 'function') {
                continue;
            }
            var bundleConfiguration = bundle.getConfiguration();

            // Get the command list
            if (bundleConfiguration.hasOwnProperty('cli')) {
                this._commands[bundleId] = bundleConfiguration.cli;
            }
        }
    }

    /**
     * Executed when the application starts
     */
    *onApplicationStart()
    {
        var parameters, options,
            bundle, bundleId, bundleCommands,
            commandId;


        // Get the parameters and options
        options = minimist(process.argv.slice(2));
        parameters = options._;

        // Get the command id
        commandId = null;
        if (parameters.length > 0) {
            commandId = parameters.shift();
        }

        // Quiet option
        if (options.quiet) {
            this.quietModeOn();
        }

        // Help option
        if (options.help && commandId) {
            yield this.displayCommandHelp(commandId);
            return;
        }

        // Execute the provided command name
        if (commandId) {
            yield this.executeCommand(commandId, parameters, options);
            return;
        }

        // Display the available commands from bundles
        yield this.displayGeneralHelp();

        // Turn off the quiet mode
        this.quietModeOff();
    }

    /**
     * Execute a command from a bundle
     *
     * @param   {String}    commandId   The command id
     * @param   {Array}     parameters  The command parameters
     * @param   {Object}    options     The options
     */
    *executeCommand(commandId, parameters, options)
    {
        // Get the bundle id and the command name
        var commandIdInfo = commandId.split(':');
        if (commandIdInfo.length !== 2) {
            console.error('You must specify the bundle id and the command name'.bgBlack.red);
            return;
        }
        var bundleId = commandIdInfo[0];
        var commandName = commandIdInfo[1];

        // Get the commands of the bundle
        if (!this._commands.hasOwnProperty(bundleId)) {
            console.error('The bundle '.bgBlack.red +
                          bundleId.bgBlack.yellow +
                          ' is not available'.bgBlack.red);
            return;
        }
        var bundleCommands = this._commands[bundleId];

        // Get the command
        if (!bundleCommands.hasOwnProperty(commandName)) {
            console.error('The bundle '.bgBlack.red +
                          bundleId.bgBlack.yellow +
                          ' does not have the command '.bgBlack.red +
                          commandName.green);
            return;
        }
        var command = bundleCommands[commandName];

        // Execute the command
        var commandMethod = command.method;
        if (!commandMethod) {
            console.error('The command does not have a method to execute'.bgBlack.red);
            return;
        }
        var bundle = this._bundles[bundleId];
        if (typeof bundle[commandMethod] !== 'function') {
            console.error('The command '.bgBlack.red +
                          commandName.bgBlack.green +
                          ' has an invalid method '.bgBlack.red);
            return;
        }
        if ('GeneratorFunction' !== bundle[commandMethod].constructor.name) {
            console.error('The command '.bgBlack.red +
                          commandName.bgBlack.green +
                          ' must implement a generator method'.bgBlack.red);
            return;
        }
        yield bundle[commandMethod].apply(bundle, parameters);
    }

    /**
     * Display the available commands from bundles
     */
    *displayGeneralHelp()
    {
        // Display the header
        let title = "SolfegeJS CLI";
        if (this.configuration && this.configuration.title) {
            title = this.configuration.title;
        }
        console.info(title.bgBlack.cyan);
        console.info("-".repeat(title.length).bgBlack.cyan+"\n");
        console.info('Usage: ' + 
                     'bundleId'.bgBlack.yellow +
                     ':' +
                     'commandName'.bgBlack.green +
                     ' [argument1] [argument2] ...\n');


        // Display each bundle CLI
        var sortedBundleIds = Object.keys(this._commands).sort();
        var bundleCount = sortedBundleIds.length;
        var bundleIndex;
        for (bundleIndex = 0; bundleIndex < bundleCount; ++bundleIndex) {
            var bundleId = sortedBundleIds[bundleIndex];
            var bundleCommands = this._commands[bundleId];
            var commandName;

            // Display the bundle id
            console.info(bundleId.yellow);
            for (commandName in bundleCommands) {
                var command = bundleCommands[commandName];

                // Display the command name
                process.stdout.write('  - ' + commandName.bgBlack.green);

                // Display the description
                if (command.description) {
                     process.stdout.write(' : ' + command.description);
                }

                process.stdout.write('\n');
            }

            process.stdout.write('\n');
        }
    }

    /**
     * Display the available options for the specified command
     *
     * @param   {String}    commandId   The command id
     */
    *displayCommandHelp(commandId)
    {
        // Get the bundle id and the command name
        var commandIdInfo = commandId.split(':');
        if (commandIdInfo.length !== 2) {
            console.info('You must specify the bundle id and the command name'.bgBlack.red);
            return;
        }
        var bundleId = commandIdInfo[0];
        var commandName = commandIdInfo[1];

        // Check if the bundle and the command exists
        if (!this._commands.hasOwnProperty(bundleId) || !this._commands[bundleId].hasOwnProperty(commandName)) {
            console.info('Command not found'.bgBlack.red);
            return;
        }

        // Display the header
        console.info('SolfegeJS CLI'.bgBlack.cyan);
        console.info('-------------\n'.bgBlack.cyan);
        console.info('Usage: ' + 
                     bundleId.bgBlack.yellow +
                    ':' +
                    commandName.bgBlack.green +
                    ' [argument1] [argument2] ...\n');


        // Display the command informations
        var information = this._commands[bundleId][commandName];
        if (information.description) {
            console.info(information.description);
        }
        if (information.help) {
            console.info();
            if (Array.isArray(information.help)) {
                information.help.forEach(line => {
                    console.info(line);
                });
            } else {
                console.info(information.help);
            }
        }
    }

    /**
     * Activate the quiet mode
     */
    quietModeOn()
    {
        if (!this.oldStdoutWrite) {
            this.oldStdoutWrite = process.stdout.write;
            process.stdout.write = function(){};
        }
        if (!this.oldStderrWrite) {
            this.oldStderrWrite = process.stderr.write;
            process.stderr.write = function(){};
        }
    }

    /**
     * Deactivate the quiet mode
     */
    quietModeOff()
    {
        if (this.oldStdoutWrite) {
            process.stdout.write = this.oldStdoutWrite;
            this.oldStdoutWrite = null;
        }
        if (this.oldStderrWrite) {
            process.stderr.write = this.oldStderrWrite;
            this.oldStderrWrite = null;
        }
    }
}

