"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _bundle = require("../../bundle");

var _bundle2 = _interopRequireDefault(_bundle);

var application = new _solfegejs2["default"].kernel.Application(__dirname);
application.addBundle("console", new _bundle2["default"].Console());

application.start();