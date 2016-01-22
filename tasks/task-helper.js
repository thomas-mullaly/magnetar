(function () {
    "use strict";

    let fs = require("fs-plus");
    let path = require("path");

    module.exports = (grunt) => {
        return {
            copy: (source, destination, options) => {
                if (!grunt.file.exists(source)) {
                    grunt.fatal("Cannot copy non-existent #{source.cyan} to #{destination.cyan}");
                }

                if (!options) {
                    options = {
                        filter: null
                    };
                }

                let copyFile = (sourcePath, destinationPath) => {
                    if (options.filter && !options.filter.test(sourcePath)) {
                        grunt.verbose.writeln("Skipping file");
                        return;
                    }

                    let stats = fs.lstatSync(sourcePath);
                    if (stats.isSymbolicLink()) {
                        grunt.file.mkdir(path.dirname(destinationPath));
                        fs.symlinkSync(fs.readlinkSync(sourcePath), destinationPath);
                    } else if (stats.isFile()) {
                        grunt.file.copy(sourcePath, destinationPath);
                    }

                    if (grunt.file.exists(destinationPath)) {
                        fs.chmodSync(destinationPath, fs.statSync(sourcePath).mode)
                    }
                };

                if (grunt.file.isFile(source)) {
                    copyFile(source, destination);
                } else {
                    try {
                        let onFile = (sourcePath) => {
                            let destinationPath = path.join(destination, path.relative(source, sourcePath));
                            copyFile(sourcePath, destinationPath);
                        };
                        let onDirectory = (sourcePath) => {
                            if (fs.isSymbolicLinkSync(sourcePath)) {
                                let destinationPath = path.join(destination, path.relative(source, sourcePath));
                                copyFile(sourcePath, destinationPath);
                                return false;
                            } else {
                                return true;
                            }
                        };
                        fs.traverseTreeSync(source, onFile, onDirectory);
                    } catch (error) {
                        grunt.fatal(error)
                    }
                }

                grunt.verbose.writeln("Copied #{source.cyan} to #{destination.cyan}.")
            }
        }
    };
})();
