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
