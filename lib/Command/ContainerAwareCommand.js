"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _AbstractCommand = require("./AbstractCommand");

var _AbstractCommand2 = _interopRequireDefault(_AbstractCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContainerAwareCommand = class ContainerAwareCommand extends _AbstractCommand2.default {
  setContainer(container) {
    this.container = container;
  }

  getContainer() {
    return this.container;
  }
};
exports.default = ContainerAwareCommand;
module.exports = exports["default"];