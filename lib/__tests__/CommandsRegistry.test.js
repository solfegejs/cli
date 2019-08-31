const CommandsRegistry = require("../CommandsRegistry");

describe("CommandsRegistry", () => {
  const container = {};
  let registry;

  beforeEach(() => {
    registry = new CommandsRegistry(container);
  });

  describe("addCommand()", () => {
    it("should register a command", () => {
      const command = Symbol("any command");
      registry.addCommand(command);

      expect(registry.getCommands()).toContain(command);
    });
  });
});
