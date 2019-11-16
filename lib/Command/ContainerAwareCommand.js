const AbstractCommand = require("../../AbstractCommand");

console.error("DEPRECATED @solfege/cli/lib/Command/ContainerAwareCommand");

module.exports = class ContainerAwareCommand extends AbstractCommand {
  setContainer(container) {
    this.container = container;
  }

  getContainer() {
    return this.container;
  }
};
