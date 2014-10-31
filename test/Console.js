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
    var value;


    // Capture the output
    var oldStdoutWrite, oldStderrWrite, output;
    var quietModeOn = function()
    {
        output = '';
        if (!oldStdoutWrite) {
            oldStdoutWrite = process.stdout.write;
            process.stdout.write = function(str){ output += str };
        }
        if (!oldStderrWrite) {
            oldStderrWrite = process.stderr.write;
            process.stderr.write = function(str){ output += str };
        }
    };
    var quietModeOff = function()
    {
        if (oldStdoutWrite) {
            process.stdout.write = oldStdoutWrite;
            oldStdoutWrite = null;
        }
        if (oldStderrWrite) {
            process.stderr.write = oldStderrWrite;
            oldStderrWrite = null;
        }
    };



    /**
     * Initialize the test suite
     */
    var createApplication = function()
    {
        // Initialize the application
        var application = new Application(__dirname);

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
                value = 'YEAH';
                console.log('foo');
            },
            tac: function*() {
                value = 'OK';
                console.log('bar');
            }
        });

        return application;
    };


    /**
     * Test to execute bundle commands
     */
    describe('execute method', function()
    {
        // Simple command
        it('should run a simple command', function(done)
        {
            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', 'fake-a:tic'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(value).to.equal('YEAH');
                expect(output).to.equal('foo\n');
                done();
            }, 20);
        });
    });

    /**
     * Test the --quiet option
     */
    describe('execute method with quiet option', function()
    {
        it('should output nothing (option in the beginning)', function(done)
        {
            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', '--quiet', 'fake-a:tic'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(value).to.equal('YEAH');
                expect(output).to.equal('');
                done();
            }, 20);
        });

        it('should output nothing (option in the end)', function(done)
        {
            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', 'fake-a:tac', '--quiet'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(value).to.equal('OK');
                expect(output).to.equal('');
                done();
            }, 20);
        });
    });
});
