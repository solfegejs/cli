/* @flow */
import type {CommandInterface} from "../interface"

/**
 * Commands registry
 */
export default class CommandsRegistry
{
    /**
     * Service container
     */
    container:any;

    /**
     * Commands
     */
    commands:Set<CommandInterface>;

    /**
     * Constructor
     *
     * @param   {Container}     container   The service container
     */
    constructor(container:any):void
    {
        this.container = container;

        // Initialize commands
        this.commands = new Set();
    }

    /**
     * Add command
     *
     * @param   {CommandInterface}    command     Command
     */
    addCommand(command:CommandInterface):void
    {
        // @todo How to check if the command is container aware?
        if (typeof command.setContainer === "function") {
            command.setContainer(this.container);
        }

        this.commands.add(command);
    }

    /**
     * Get commands
     *
     * @return  {Set}                   Commands
     */
    getCommands():Set<CommandInterface>
    {
        return this.commands;
    }
}
