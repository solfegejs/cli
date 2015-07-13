"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var Application = _solfegejs2["default"].kernel.Application;

function _ref(line) {
    console.info(line);
}

function _ref2() {}

function _ref3() {}

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

        // Initialize the configuration
        this._configuration = require(__dirname + "/../config/default");

        // Initialize the bundle list
        this._bundles = new Map();

        // Initialize the command list
        this._commands = new Map();
    }

    _createClass(Console, [{
        key: "setApplication",

        /**
         * Set the application
         *
         * @public
         * @param   {solfege.kernel.Application}    application     Application instance
         */
        value: function* setApplication(application) {
            if (!(application instanceof Application)) throw new TypeError("Value of argument 'application' violates contract.");

            this._application = application;

            // Set listeners
            var bindGenerator = _solfegejs2["default"].util.Function.bindGenerator;
            this._application.on(_solfegejs2["default"].kernel.Application.EVENT_BUNDLES_INITIALIZED, bindGenerator(this, this.onBundlesInitialized));
            this._application.on(_solfegejs2["default"].kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
        }
    }, {
        key: "overrideConfiguration",

        /**
         * Override the configuration of the bundles
         *
         * @public
         * @param   {Object}    configuration   The configuration object
         */
        value: function* overrideConfiguration(configuration) {
            this._configuration = configuration;
        }
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
            if (typeof message !== "string") throw new TypeError("Value of argument 'message' violates contract.");
            if (typeof level !== "number") throw new TypeError("Value of argument 'level' violates contract.");
            if (typeof foregroundColor !== "string") throw new TypeError("Value of argument 'foregroundColor' violates contract.");
            if (typeof backgroundColor !== "string") throw new TypeError("Value of argument 'backgroundColor' violates contract.");

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
        value: function* onBundlesInitialized() {
            this._bundles = this.application.getBundles();

            // Get the available commands of each bundle
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._bundles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2);

                    var bundleId = _step$value[0];
                    var bundle = _step$value[1];

                    // Get the configuration of the bundle
                    if (typeof bundle.getConfiguration !== "function") {
                        continue;
                    }
                    var bundleConfiguration = bundle.getConfiguration();

                    // Get the command list
                    if (bundleConfiguration.hasOwnProperty("cli")) {
                        this._commands.set(bundleId, bundleConfiguration.cli);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "onApplicationStart",

        /**
         * Executed when the application starts
         */
        value: function* onApplicationStart() {
            var parameters = undefined,
                options = undefined,
                bundle = undefined,
                bundleId = undefined,
                bundleCommands = undefined,
                commandId = undefined;

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
    }, {
        key: "executeCommand",

        /**
         * Execute a command from a bundle
         *
         * @param   {String}    commandId   The command id
         * @param   {Array}     parameters  The command parameters
         * @param   {Object}    options     The options
         */
        value: function* executeCommand(commandId, parameters, options) {
            if (typeof commandId !== "string") throw new TypeError("Value of argument 'commandId' violates contract.");

            // Get the bundle id and the command name
            var commandIdInfo = commandId.split(":");
            if (commandIdInfo.length !== 2) {
                console.error("You must specify the bundle id and the command name".bgBlack.red);
                return;
            }
            var bundleId = commandIdInfo[0];
            var commandName = commandIdInfo[1];

            // Get the commands of the bundle
            if (!this._commands.has(bundleId)) {
                console.error("The bundle ".bgBlack.red + bundleId.bgBlack.yellow + " is not available".bgBlack.red);
                return;
            }
            var bundleCommands = this._commands.get(bundleId);

            // Get the command
            if (!bundleCommands.hasOwnProperty(commandName)) {
                console.error("The bundle ".bgBlack.red + bundleId.bgBlack.yellow + " does not have the command ".bgBlack.red + commandName.green);
                return;
            }
            var command = bundleCommands[commandName];

            // Execute the command
            var commandMethod = command.method;
            if (!commandMethod) {
                console.error("The command does not have a method to execute".bgBlack.red);
                return;
            }
            var bundle = this._bundles.get(bundleId);
            if (typeof bundle[commandMethod] !== "function") {
                console.error("The command ".bgBlack.red + commandName.bgBlack.green + " has an invalid method ".bgBlack.red);
                return;
            }
            if ("GeneratorFunction" !== bundle[commandMethod].constructor.name) {
                console.error("The command ".bgBlack.red + commandName.bgBlack.green + " must implement a generator method".bgBlack.red);
                return;
            }
            yield bundle[commandMethod].apply(bundle, parameters);
        }
    }, {
        key: "displayGeneralHelp",

        /**
         * Display the available commands from bundles
         */
        value: function* displayGeneralHelp() {
            // Display the header
            var title = "SolfegeJS CLI";
            if (this.configuration && this.configuration.title) {
                title = this.configuration.title;
            }
            console.info(title.bgBlack.cyan);
            console.info("-".repeat(title.length).bgBlack.cyan + "\n");
            console.info("Usage: " + "bundleId".bgBlack.yellow + ":" + "commandName".bgBlack.green + " [argument1] [argument2] ...\n");

            // Display each bundle CLI
            var bundleIds = this._commands.keys();
            var sortedBundleIds = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = bundleIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var bundleId = _step2.value;

                    sortedBundleIds.push(bundleId);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            sortedBundleIds = sortedBundleIds.sort();
            var bundleCount = sortedBundleIds.length;
            for (var bundleIndex = 0; bundleIndex < bundleCount; ++bundleIndex) {
                var bundleId = sortedBundleIds[bundleIndex];
                var bundleCommands = this._commands.get(bundleId);

                // Display the bundle id
                console.info(bundleId.yellow);
                for (var commandName in bundleCommands) {
                    var command = bundleCommands[commandName];

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
        }
    }, {
        key: "displayCommandHelp",

        /**
         * Display the available options for the specified command
         *
         * @param   {string}    commandId   The command id
         */
        value: function* displayCommandHelp(commandId) {
            if (typeof commandId !== "string") throw new TypeError("Value of argument 'commandId' violates contract.");

            // Get the bundle id and the command name
            var commandIdInfo = commandId.split(":");
            if (commandIdInfo.length !== 2) {
                console.info("You must specify the bundle id and the command name".bgBlack.red);
                return;
            }
            var bundleId = commandIdInfo[0];
            var commandName = commandIdInfo[1];

            // Check if the bundle and the command exists
            if (!this._commands.has(bundleId) || !this._commands.get(bundleId).hasOwnProperty(commandName)) {
                console.info("Command not found".bgBlack.red);
                return;
            }

            // Display the header
            console.info("SolfegeJS CLI".bgBlack.cyan);
            console.info("-------------\n".bgBlack.cyan);
            console.info("Usage: " + bundleId.bgBlack.yellow + ":" + commandName.bgBlack.green + " [argument1] [argument2] ...\n");

            // Display the command informations
            var information = this._commands.get(bundleId)[commandName];
            if (information.description) {
                console.info(information.description);
            }
            if (information.help) {
                console.info();
                if (Array.isArray(information.help)) {
                    information.help.forEach(_ref);
                } else {
                    console.info(information.help);
                }
            }
        }
    }, {
        key: "quietModeOn",

        /**
         * Activate the quiet mode
         */
        value: function quietModeOn() {
            if (!this.oldStdoutWrite) {
                this.oldStdoutWrite = process.stdout.write;
                process.stdout.write = _ref2;
            }
            if (!this.oldStderrWrite) {
                this.oldStderrWrite = process.stderr.write;
                process.stderr.write = _ref3;
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
        key: "configuration",

        /**
         * The configuration
         *
         * @public
         * @member  {Object}
         */
        get: function get() {
            return this._configuration;
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