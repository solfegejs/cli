/* @flow */

/**
 * Command interface
 */
export interface CommandInterface
{
    /**
     * Get command name
     *
     * @return  {string}    Command name
     */
    getName():string;

    /**
     * Condigure command
     */
    configure():void | Promise<void>;

    /**
     * Execute the command
     *
     * @param   {Array}     parameters  Command parameters
     */
    execute(parameters:Array<string>):void | Promise<void>;
}

