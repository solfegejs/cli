/**
 * Compiler pass for the service container
 * It handles tags to register console commands
 */
module.exports = class CommandCompilerPass {
  async process(container) {
    const definition = container.getDefinition("solfege_console_commands_registry");

    const serviceIds = container.findTaggedServiceIds("solfege.console.command");
    for (const serviceId of serviceIds) {
      const reference = container.getReference(serviceId);
      definition.addMethodCall("addCommand", [reference]);
    }
  }
};
