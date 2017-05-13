/* @flow */
import AbstractCommand from "./AbstractCommand";

/**
 * A container aware command
 */
export default class ContainerAwareCommand extends AbstractCommand
{
    /**
     * Service container
     */
    container:any;

    /**
     * Set the service container
     *
     * @param   {Container}     container   Service container
     */
    setContainer(container:any):void
    {
        this.container = container;
    }

    /**
     * Get the service container
     *
     * @return  {Container}                 Service container
     */
    getContainer():any
    {
        return this.container;
    }
}
