"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _bundleEs5 = require("../../bundle-es5");

var _bundleEs52 = _interopRequireDefault(_bundleEs5);

var application = new _solfegejs2["default"].kernel.Application(__dirname);
application.addBundle("console", new _bundleEs52["default"].Console());

application.start();