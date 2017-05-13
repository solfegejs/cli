"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

var _isGenerator = require("is-generator");

var _safe = require("colors/safe");

var _safe2 = _interopRequireDefault(_safe);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _CommandCompilerPass = require("./DependencyInjection/Compiler/CommandCompilerPass");

var _CommandCompilerPass2 = _interopRequireDefault(_CommandCompilerPass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bundle = class Bundle {
    constructor() {}

    getPath() {
        return __dirname;
    }

    *initialize(application) {
        this.application = application;

        this.application.on("start", (0, _bindGenerator2.default)(this, this.onStart));
    }

    *configureContainer(container) {
        this.container = container;

        this.container.addCompilerPass(new _CommandCompilerPass2.default());
    }

    *onStart(application, parameters) {
        var commandsRegistry = yield this.container.get("solfege_console_commands_registry");
        var commands = commandsRegistry.getCommands();

        var args = (0, _minimist2.default)(parameters);
        parameters = args._;
        var options = Object.assign({}, args);
        delete options._;

        var commandMap = new Map();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = commands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var command = _step.value;

                if (typeof command.getName !== "function") {
                    throw new Error("Command must implement \"getName\" method.");
                }

                if ((0, _isGenerator.fn)(command.configure)) {
                    yield command.configure();
                }

                var name = command.getName();
                commandMap.set(name, command);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (parameters.length > 0) {
            var commandName = parameters.shift();

            if (commandMap.has(commandName)) {
                var _command = commandMap.get(commandName);

                var commandParameters = parameters.slice(0);
                if (_command) {
                    yield _command.execute(commandParameters, options);
                }
                return;
            }
        }

        var title = "SolfegeJS CLI";
        console.info(_safe2.default.bgBlack.cyan(title));
        console.info(_safe2.default.bgBlack.cyan("-".repeat(title.length)) + "\n");

        yield this.displayAvailableCommands(commands);
    }

    *displayAvailableCommands(commands) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = commands[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var command = _step2.value;

                var name = command.getName();
                var description = "";

                if (typeof command.getDescription === "function") {
                    description = command.getDescription();
                }

                console.info(_safe2.default.green(name) + "   " + description);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    }
};
exports.default = Bundle;
module.exports = exports["default"];