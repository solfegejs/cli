var solfege = require('solfegejs');
var expect = require('chai').expect;
var should = require('chai').should();
var colors = require('colors');

/**
 * Test the Console class
 */
describe('Console', function()
{
    var Application = solfege.kernel.Application;
    var Console = require('../bundle-es5/Console');
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
                            description: 'tac short desc',
                            help: [
                                'line 1',
                                'line 2',
                                'line 3',
                            ],
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

        // A command without the command name
        it('should not run a command without the command name', function(done)
        {
            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', 'fake-a'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(output).to.equal('You must specify the bundle id and the command name'.bgBlack.red+'\n');
                done();
            }, 20);
        });

        // A command with a wrong bundle id
        it('should not run a command with a wrong bundle id', function(done)
        {
            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', 'unknown:tic'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(output).to.equal('The bundle '.bgBlack.red +
                                        'unknown'.bgBlack.yellow +
                                        ' is not available'.bgBlack.red +
                                        '\n');
                done();
            }, 20);
        });

        // A command with a wrong command name
        it('should not run a command with a wrong command name', function(done)
        {
            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', 'fake-a:tiiiic'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(output).to.equal('The bundle '.bgBlack.red +
                                        'fake-a'.bgBlack.yellow +
                                        ' does not have the command '.bgBlack.red +
                                        'tiiiic'.green +
                                        '\n');
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

    /**
     * Test the --help option
     */
    describe('execute method with help option', function()
    {
        it('should output the additional description', function(done)
        {
            var expectedOutput = 'SolfegeJS CLI'.bgBlack.cyan + '\n' +
                    '-------------\n'.bgBlack.cyan + '\n' +
                    'Usage: ' + 
                    'fake-a'.bgBlack.yellow +
                    ':' +
                    'tac'.bgBlack.green +
                    ' [argument1] [argument2] ...\n' + '\n' +
                    'tac short desc' + '\n\n' +
                    'line 1' + '\n' +
                    'line 2' + '\n' +
                    'line 3' + '\n';


            var application = createApplication();
            quietModeOn();
            process.argv = ['', '', 'fake-a:tac', '--help'];
            application.start();
            setTimeout(function() {
                quietModeOff();
                expect(output).to.equal(expectedOutput);
                done();
            }, 20);
        });
    });

});
