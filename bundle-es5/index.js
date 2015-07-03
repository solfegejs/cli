/**
 * @namespace solfege.bundle.cli
 */
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

exports["default"] = _solfegejs2["default"].util.ObjectProxy.createPackage(__dirname);
module.exports = exports["default"];