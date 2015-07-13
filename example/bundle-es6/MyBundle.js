export default class MyBundle
{
    getConfiguration()
    {
        return {
            cli: {
                command1: {
                    description: "Test",
                    method: "test"
                }
            }
        };
    }

    *test()
    {
        console.log("test");
    }
}
