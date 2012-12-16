var fs = require('fs');
var jsdom = require('jsdom').jsdom;

exports.evalPasswordComplexity = function(password, callback) {
  jsdom.env({'html': '<input id="password" value="' + password + '" />',
             'scripts': [__dirname + '/jquery.js',
                         __dirname + '/jquery.complexify.js/jquery.complexify.js'],
             'done': function(errors, window) {
               var $ = window.$;
               var options = {
                 // minimumChars: 8,
                 // strengthScaleFactor: 1,
               };

               $("#password").complexify(options, function(valid, complexity) {
                 callback(null, {"complexity": complexity, "valid": valid});
               });

               $('#password').trigger('keyup');
             }});
}
