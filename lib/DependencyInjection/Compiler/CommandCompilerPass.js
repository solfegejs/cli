"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CommandCompilerPass = class CommandCompilerPass {
    *process(container) {
        var definition = container.getDefinition("solfege_console_commands_registry");

        var serviceIds = container.findTaggedServiceIds("solfege.console.command");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = serviceIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var serviceId = _step.value;

                var reference = container.getReference(serviceId);
                definition.addMethodCall("addCommand", [reference]);
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
    }
};
exports.default = CommandCompilerPass;
module.exports = exports["default"];