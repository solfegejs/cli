const assert = require("assert");

module.exports = class Command5 {
  getName() {
    return "command5";
  }

  execute() {
    assert(false, "assert false");
  }
};
