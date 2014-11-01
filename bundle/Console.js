var solfege = require('solfegejs');

/**
 * The command line interface of SolfegeJS
 */
var Console = solfege.util.Class.create(function()
{
    // Initialize the bundle list
    this.bundles = {};

    // Initialize the command list
    this.commands = {};
}, 'solfege.bundle.cli.Console');
var proto = Console.prototype;

/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * The bundle list
 *
 * @type {Object}
 * @api private
 */
proto.bundles;

/**
 * The command list per bundle
 *
 * @type {Object}
 * @api private
 */
proto.commands;

/**
 * Set the application
 *
 * @public
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;

    // Set listeners
    var bindGenerator = solfege.util.Function.bindGenerator;
    this.application.on(solfege.kernel.Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
    this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
};

/**
 * Executed when the bundles of the application are initialized
 */
proto.onBundlesInitialized = function*()
{
    this.bundles = this.application.getBundles();

    // Get the available commands of each bundle
    for (var bundleId in this.bundles) {
        var bundle = this.bundles[bundleId];

        // Get the configuration of the bundle
        if (typeof bundle.getConfiguration !== 'function') {
            continue;
        }
        var bundleConfiguration = bundle.getConfiguration();

        // Get the command list
        if (bundleConfiguration.hasOwnProperty('cli')) {
            this.commands[bundleId] = bundleConfiguration.cli;
        }
    }
};

/**
 * Executed when the application starts
 */
proto.onApplicationStart = function*()
{
    var charm, parameters, options,
        bundle, bundleId, bundleCommands,
        commandId, commandIdInfo, commandName, command, commandMethod;

    // Initialize the charm module
    charm = require('charm')();
    charm.pipe(process.stdout);

    // Get the parameters and options
    options = require("minimist")(process.argv.slice(2));
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
};

/**
 * Execute a command from a bundle
 *
 * @param   {String}    commandId   The command id
 * @param   {Array}     parameters  The command parameters
 * @param   {Object}    options     The options
 */
proto.executeCommand = function*(commandId, parameters, options)
{
    commandIdInfo = commandId.split(':');

    // Get the bundle id and the command name
    if (commandIdInfo.length !== 2) {
        charm.background('black').foreground('red')
            .write('You must specify the bundle id and the command name\n');
        return;
    }
    bundleId = commandIdInfo[0];
    commandName = commandIdInfo[1];

    // Get the commands of the bundle
    if (!this.commands.hasOwnProperty(bundleId)) {
        charm.background('black').foreground('red')
            .write('The bundle ')
            .foreground('yellow').write(bundleId)
            .foreground('red').write(' is not available\n');
        return;
    }
    bundleCommands = this.commands[bundleId];

    // Get the command
    if (!bundleCommands.hasOwnProperty(commandName)) {
        charm.background('black').foreground('red')
            .write('The bundle ')
            .foreground('yellow').write(bundleId)
            .foreground('red').write(' does not have the command ')
            .foreground('green').write(commandName)
            .write('\n');
        return;
    }
    command = bundleCommands[commandName];

    // Execute the command
    commandMethod = command.method;
    if (!commandMethod) {
        charm.background('black').foreground('red')
            .write('The command does not have a method to execute\n');
        return;
    }
    bundle = this.bundles[bundleId];
    if (typeof bundle[commandMethod] !== 'function') {
        charm.background('black').foreground('red')
            .write('The command ')
            .foreground('green').write(commandName)
            .foreground('red').write(' has an invalid method\n');
        return;
    }
    if ('GeneratorFunction' !== bundle[commandMethod].constructor.name) {
        charm.background('black').foreground('red')
            .write('The command ')
            .foreground('green').write(commandName)
            .foreground('red').write(' must implement a generator method\n');
        return;
    }
    yield bundle[commandMethod].apply(bundle, parameters);
};

/**
 * Display the available commands from bundles
 */
proto.displayGeneralHelp = function*()
{
    // Initialize the charm module
    var charm = require('charm')();
    charm.pipe(process.stdout);


    // Display the header
    charm.background('black').foreground('cyan')
        .write('SolfegeJS CLI\n')
        .write('-------------\n\n')
        .foreground('white').write('Usage: ')
        .foreground('yellow').write('bundleId')
        .foreground('white').write(':')
        .foreground('green').write('commandName')
        .foreground('white').write(' [argument1] [argument2] ...')
        .write('\n\n');

    // Display each bundle CLI
    var sortedBundleIds = Object.keys(this.commands).sort();
    var bundleCount = sortedBundleIds.length;
    var bundleIndex;
    for (bundleIndex = 0; bundleIndex < bundleCount; ++bundleIndex) {
        bundleId = sortedBundleIds[bundleIndex];
        bundleCommands = this.commands[bundleId];

        // Display the bundle id
        charm.foreground('yellow').write(bundleId + '\n');
        for (commandName in bundleCommands) {
            command = bundleCommands[commandName];

            // Display the command name
            charm.foreground('white').write('  - ').foreground('green').write(commandName);

            // Display the description
            if (command.description) {
                 charm.foreground('white').write(' : ' + command.description);
            }

            charm.write('\n');
        }

        charm.write('\n');
    }
};

/**
 * Display the available options for the specified command
 *
 * @param   {String}    commandId   The command id
 */
proto.displayCommandHelp = function*(commandId)
{
    // Initialize the charm module
    var charm = require('charm')();
    charm.pipe(process.stdout);


    // Get the bundle id and the command name
    commandIdInfo = commandId.split(':');
    if (commandIdInfo.length !== 2) {
        charm.background('black').foreground('red')
            .write('You must specify the bundle id and the command name\n');
        return;
    }
    bundleId = commandIdInfo[0];
    commandName = commandIdInfo[1];


    // Display the header
    charm.background('black').foreground('cyan')
        .write('SolfegeJS CLI\n')
        .write('-------------\n\n')
        .foreground('white').write('Usage: ')
        .foreground('yellow').write(bundleId)
        .foreground('white').write(':')
        .foreground('green').write(commandName)
        .foreground('white').write(' [argument1] [argument2] ...')
        .write('\n\n');


};

/**
 * Activate the quiet mode
 */
proto.quietModeOn = function()
{
    if (!this.oldStdoutWrite) {
        this.oldStdoutWrite = process.stdout.write;
        process.stdout.write = function(){};
    }
    if (!this.oldStderrWrite) {
        this.oldStderrWrite = process.stderr.write;
        process.stderr.write = function(){};
    }
};

/**
 * Deactivate the quiet mode
 */
proto.quietModeOff = function()
{
    if (this.oldStdoutWrite) {
        process.stdout.write = this.oldStdoutWrite;
        this.oldStdoutWrite = null;
    }
    if (this.oldStderrWrite) {
        process.stderr.write = this.oldStderrWrite;
        this.oldStderrWrite = null;
    }
};

module.exports = Console;
