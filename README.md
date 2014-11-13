solfegejs-cli
=============

Command Line Interface of SolfegeJS


Installation
------------

    npm install solfegejs-cli

In the main file of the SolfegeJS application:

    var solfege = require('solfegejs');
    var cli = require('solfegejs-cli');

    var application = solfege.kernel.Application(__dirname);
    application.addBundle('console', cli.Console);

    application.start();
