/* @flow */
import type {CommandInterface} from "../../interface"

/**
 * An abstract command
 */
export default class AbstractCommand implements CommandInterface
{
    /**
     * Command name
     */
    name:string;

    /**
     * Command description
     */
    description:string;

    /**
     * Constructor
     */
    constructor()
    {
        // Initialize properties
        this.description = "";
    }

    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName():string
    {
        return this.name;
    }

    /**
     * Set command name
     *
     * @param   {string}    name    Command name
     */
    setName(name:string):void
    {
        this.name = name;
    }

    /**
     * Get command description
     *
     * @return  {string}    Command description
     */
    getDescription():string
    {
        return this.description;
    }

    /**
     * Set command description
     *
     * @param   {string}    description     Command description
     */
    setDescription(description:string):void
    {
        this.description = description;
    }

    /**
     * Condigure command
     */
    async configure():void | Promise<void>
    {
    }

    /**
     * Execute the command
     *
     * @param   {Array}     parameters  Command parameters
     */
    async execute(parameters:Array<string>):void | Promise<void>
    {
    }
}
