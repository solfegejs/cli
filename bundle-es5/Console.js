"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

/**
 * The command line interface of SolfegeJS
 *
 * @class solfege.bundle.cli.Console
 */

var Console = (function () {
    /**
     * Constructor
     */

    function Console() {
        _classCallCheck(this, Console);

        // Initialize the bundle list
        this._bundles = {};

        // Initialize the command list
        this._commands = {};
    }

    _createClass(Console, [{
        key: "setApplication",

        /**
         * Set the application
         *
         * @public
         * @param   {solfege.kernel.Application}    application     Application instance
         */
        value: _regeneratorRuntime.mark(function setApplication(application) {
            var bindGenerator;
            return _regeneratorRuntime.wrap(function setApplication$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        this._application = application;

                        bindGenerator = _solfegejs2["default"].util.Function.bindGenerator;

                        this._application.on(_solfegejs2["default"].kernel.Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
                        this._application.on(_solfegejs2["default"].kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));

                    case 4:
                    case "end":
                        return context$2$0.stop();
                }
            }, setApplication, this);
        })
    }, {
        key: "output",

        /**
         * Write in the standard output
         *
         * @public
         * @param   {string}    message             The message
         * @param   {integer}   level               The verbose level
         * @param   {string}    foregroundColor     The foreground color
         * @param   {string}    backgroundColor     The background color
         */
        value: function output(message, level, foregroundColor, backgroundColor) {
            var options = (0, _minimist2["default"])(process.argv.slice(2));

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
            if (foregroundColor && _colors2["default"].styles.hasOwnProperty(foregroundColor)) {
                message = message[foregroundColor];
            }
            if (backgroundColor && _colors2["default"].styles.hasOwnProperty(backgroundColor + "BG")) {
                message = message[backgroundColor + "BG"];
            }

            // Output the message
            if (level <= maxLevel) {
                console.info(message);
            }
        }
    }, {
        key: "onBundlesInitialized",

        /**
         * Executed when the bundles of the application are initialized
         */
        value: _regeneratorRuntime.mark(function onBundlesInitialized() {
            var bundleId, bundle, bundleConfiguration;
            return _regeneratorRuntime.wrap(function onBundlesInitialized$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        this._bundles = this.application.getBundles();

                        context$2$0.t0 = _regeneratorRuntime.keys(this._bundles);

                    case 2:
                        if ((context$2$0.t1 = context$2$0.t0()).done) {
                            context$2$0.next = 11;
                            break;
                        }

                        bundleId = context$2$0.t1.value;
                        bundle = this._bundles[bundleId];

                        if (!(typeof bundle.getConfiguration !== "function")) {
                            context$2$0.next = 7;
                            break;
                        }

                        return context$2$0.abrupt("continue", 2);

                    case 7:
                        bundleConfiguration = bundle.getConfiguration();

                        // Get the command list
                        if (bundleConfiguration.hasOwnProperty("cli")) {
                            this._commands[bundleId] = bundleConfiguration.cli;
                        }
                        context$2$0.next = 2;
                        break;

                    case 11:
                    case "end":
                        return context$2$0.stop();
                }
            }, onBundlesInitialized, this);
        })
    }, {
        key: "onApplicationStart",

        /**
         * Executed when the application starts
         */
        value: _regeneratorRuntime.mark(function onApplicationStart() {
            var parameters, options, bundle, bundleId, bundleCommands, commandId;
            return _regeneratorRuntime.wrap(function onApplicationStart$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:

                        // Get the parameters and options
                        options = (0, _minimist2["default"])(process.argv.slice(2));
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

                        if (!(options.help && commandId)) {
                            context$2$0.next = 9;
                            break;
                        }

                        context$2$0.next = 8;
                        return this.displayCommandHelp(commandId);

                    case 8:
                        return context$2$0.abrupt("return");

                    case 9:
                        if (!commandId) {
                            context$2$0.next = 13;
                            break;
                        }

                        context$2$0.next = 12;
                        return this.executeCommand(commandId, parameters, options);

                    case 12:
                        return context$2$0.abrupt("return");

                    case 13:
                        context$2$0.next = 15;
                        return this.displayGeneralHelp();

                    case 15:

                        // Turn off the quiet mode
                        this.quietModeOff();

                    case 16:
                    case "end":
                        return context$2$0.stop();
                }
            }, onApplicationStart, this);
        })
    }, {
        key: "executeCommand",

        /**
         * Execute a command from a bundle
         *
         * @param   {String}    commandId   The command id
         * @param   {Array}     parameters  The command parameters
         * @param   {Object}    options     The options
         */
        value: _regeneratorRuntime.mark(function executeCommand(commandId, parameters, options) {
            var commandIdInfo, bundleId, commandName, bundleCommands, command, commandMethod, bundle;
            return _regeneratorRuntime.wrap(function executeCommand$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        commandIdInfo = commandId.split(":");

                        if (!(commandIdInfo.length !== 2)) {
                            context$2$0.next = 4;
                            break;
                        }

                        console.error("You must specify the bundle id and the command name".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 4:
                        bundleId = commandIdInfo[0];
                        commandName = commandIdInfo[1];

                        if (this._commands.hasOwnProperty(bundleId)) {
                            context$2$0.next = 9;
                            break;
                        }

                        console.error("The bundle ".bgBlack.red + bundleId.bgBlack.yellow + " is not available".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 9:
                        bundleCommands = this._commands[bundleId];

                        if (bundleCommands.hasOwnProperty(commandName)) {
                            context$2$0.next = 13;
                            break;
                        }

                        console.error("The bundle ".bgBlack.red + bundleId.bgBlack.yellow + " does not have the command ".bgBlack.red + commandName.green);
                        return context$2$0.abrupt("return");

                    case 13:
                        command = bundleCommands[commandName];
                        commandMethod = command.method;

                        if (commandMethod) {
                            context$2$0.next = 18;
                            break;
                        }

                        console.error("The command does not have a method to execute".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 18:
                        bundle = this._bundles[bundleId];

                        if (!(typeof bundle[commandMethod] !== "function")) {
                            context$2$0.next = 22;
                            break;
                        }

                        console.error("The command ".bgBlack.red + commandName.bgBlack.green + " has an invalid method ".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 22:
                        if (!("GeneratorFunction" !== bundle[commandMethod].constructor.name)) {
                            context$2$0.next = 25;
                            break;
                        }

                        console.error("The command ".bgBlack.red + commandName.bgBlack.green + " must implement a generator method".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 25:
                        context$2$0.next = 27;
                        return bundle[commandMethod].apply(bundle, parameters);

                    case 27:
                    case "end":
                        return context$2$0.stop();
                }
            }, executeCommand, this);
        })
    }, {
        key: "displayGeneralHelp",

        /**
         * Display the available commands from bundles
         */
        value: _regeneratorRuntime.mark(function displayGeneralHelp() {
            var sortedBundleIds, bundleCount, bundleIndex, bundleId, bundleCommands, commandName, command;
            return _regeneratorRuntime.wrap(function displayGeneralHelp$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        // Display the header
                        console.info("SolfegeJS CLI".bgBlack.cyan);
                        console.info("-------------\n".bgBlack.cyan);
                        console.info("Usage: " + "bundleId".bgBlack.yellow + ":" + "commandName".bgBlack.green + " [argument1] [argument2] ...\n");

                        sortedBundleIds = _Object$keys(this._commands).sort();
                        bundleCount = sortedBundleIds.length;

                        for (bundleIndex = 0; bundleIndex < bundleCount; ++bundleIndex) {
                            bundleId = sortedBundleIds[bundleIndex];
                            bundleCommands = this._commands[bundleId];

                            // Display the bundle id
                            console.info(bundleId.yellow);
                            for (commandName in bundleCommands) {
                                command = bundleCommands[commandName];

                                // Display the command name
                                process.stdout.write("  - " + commandName.bgBlack.green);

                                // Display the description
                                if (command.description) {
                                    process.stdout.write(" : " + command.description);
                                }

                                process.stdout.write("\n");
                            }

                            process.stdout.write("\n");
                        }

                    case 6:
                    case "end":
                        return context$2$0.stop();
                }
            }, displayGeneralHelp, this);
        })
    }, {
        key: "displayCommandHelp",

        /**
         * Display the available options for the specified command
         *
         * @param   {String}    commandId   The command id
         */
        value: _regeneratorRuntime.mark(function displayCommandHelp(commandId) {
            var commandIdInfo, bundleId, commandName, information;
            return _regeneratorRuntime.wrap(function displayCommandHelp$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        commandIdInfo = commandId.split(":");

                        if (!(commandIdInfo.length !== 2)) {
                            context$2$0.next = 4;
                            break;
                        }

                        console.info("You must specify the bundle id and the command name".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 4:
                        bundleId = commandIdInfo[0];
                        commandName = commandIdInfo[1];

                        if (!(!this._commands.hasOwnProperty(bundleId) || !this._commands[bundleId].hasOwnProperty(commandName))) {
                            context$2$0.next = 9;
                            break;
                        }

                        console.info("Command not found".bgBlack.red);
                        return context$2$0.abrupt("return");

                    case 9:

                        // Display the header
                        console.info("SolfegeJS CLI".bgBlack.cyan);
                        console.info("-------------\n".bgBlack.cyan);
                        console.info("Usage: " + bundleId.bgBlack.yellow + ":" + commandName.bgBlack.green + " [argument1] [argument2] ...\n");

                        information = this._commands[bundleId][commandName];

                        if (information.description) {
                            console.info(information.description);
                        }
                        if (information.help) {
                            console.info();
                            if (Array.isArray(information.help)) {
                                information.help.forEach(function (line) {
                                    console.info(line);
                                });
                            } else {
                                console.info(information.help);
                            }
                        }

                    case 15:
                    case "end":
                        return context$2$0.stop();
                }
            }, displayCommandHelp, this);
        })
    }, {
        key: "quietModeOn",

        /**
         * Activate the quiet mode
         */
        value: function quietModeOn() {
            if (!this.oldStdoutWrite) {
                this.oldStdoutWrite = process.stdout.write;
                process.stdout.write = function () {};
            }
            if (!this.oldStderrWrite) {
                this.oldStderrWrite = process.stderr.write;
                process.stderr.write = function () {};
            }
        }
    }, {
        key: "quietModeOff",

        /**
         * Deactivate the quiet mode
         */
        value: function quietModeOff() {
            if (this.oldStdoutWrite) {
                process.stdout.write = this.oldStdoutWrite;
                this.oldStdoutWrite = null;
            }
            if (this.oldStderrWrite) {
                process.stderr.write = this.oldStderrWrite;
                this.oldStderrWrite = null;
            }
        }
    }, {
        key: "application",

        /**
         * The application instance
         *
         * @public
         * @member  {solfege.kernel.Application}
         */
        get: function get() {
            return this._application;
        }
    }, {
        key: "bundles",

        /**
         * The bundle list
         *
         * @public
         * @member  {Object}
         */
        get: function get() {
            return this._bundles;
        }
    }, {
        key: "commands",

        /**
         * The command list per bundle
         *
         * @public
         * @member  {Object}
         */
        get: function get() {
            return this._commands;
        }
    }]);

    return Console;
})();

exports["default"] = Console;
module.exports = exports["default"];
// Set listeners
// Get the available commands of each bundle

// Get the configuration of the bundle
// Help option

// Execute the provided command name

// Display the available commands from bundles

// Get the bundle id and the command name

// Get the commands of the bundle

// Get the command

// Execute the command
// Display each bundle CLI

// Get the bundle id and the command name

// Check if the bundle and the command exists
// Display the command informations