const AbstractCommand = require("./AbstractCommand");

module.exports = class ContainerAwareCommand extends AbstractCommand {
  setContainer(container) {
    this.container = container;
  }

  getContainer() {
    return this.container;
  }
};
