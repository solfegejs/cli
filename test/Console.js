var solfege = require('solfegejs');
var co = require('co');
var expect = require('chai').expect;
var should = require('chai').should();

/**
 * Test the Console class
 */
describe('Console', function()
{
    var Application = solfege.kernel.Application;
    var Console = require('../bundle/Console');
    var application;
    var output;

    /**
     * Initialize the test suite
     */
    before(function()
    {
        // Initialize the application
        application = new Application(__dirname);

        // Add the engine as a bundle
        application.addBundle('console', new Console);

        // Add a fake bundle
        application.addBundle('fake-a', {
            getConfiguration: function() {
                return {
                    cli: {
                        tic: {
                            description: 'tic',
                            method: 'tic'
                        },
                        tac: {
                            description: 'tac',
                            method: 'tac'
                        }
                    }
                }
            },
            tic: function*() {
                output = 'YEAH';
            },
            tac: function*() {
                output = 'OK';
            }
        });

    });


    /**
     * Test to execute bundle commands
     */
    describe('execute method', function()
    {
        // Simple command
        it('should run a simple command', function(done)
        {
            // Simulate a command arguments
            process.argv = ['', '', 'fake-a:tic'];
            application.start();

            setTimeout(function() {
                expect(output).to.equal('YEAH');
                done();
            }, 20);
        });


    });
});
