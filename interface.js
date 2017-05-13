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
     * Set command name
     *
     * @param   {string}    name    Command name
     */
    setName(name:string):void;

    /**
     * Condigure command
     */
    configure():*;

    /**
     * Execute the command
     */
    execute():*;
}

export interface DescribedCommandInterface
{
}

export interface ContainerInterface
{
}
