var cp = require('./child-process-helpers');
var fs = require('fs');
var path = require('path');

module.exports = function(additionalArgs, callback) {
    var gruntPath = path.join('node_modules', '.bin', 'grunt') + (process.platform === 'win32' ? '.cmd' : '');

    if (!fs.existsSync(gruntPath)) {
        console.error('Grunt command does not exist at: ' + gruntPath);
        console.error('Run script/bootstrap to install Grunt');
        process.exit(1);
    }

    var args = ['--gruntfile', path.resolve('Gruntfile.js')];
    args = args.concat(additionalArgs);
    cp.spawn(gruntPath, args, callback);
};
