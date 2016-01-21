"use strict";

let gulp = require("gulp");
let ts = require("gulp-typescript");
let clean = require("gulp-clean");
let exec = require("child_process").exec;
let debug = require("gulp-debug");
let del = require("del");
let buildDir = "./build";
let compileDir = `${buildDir}/compile`;
let srcDir = "./src";

gulp.task("clean", () => {
    return del([`${compileDir}/**`]);
});

gulp.task("copy", ["clean"], () => {
    return gulp.src([
        `${srcDir}/**/*.sass`,
        `${srcDir}/**/*.js`,
        `${srcDir}/**/*.html`,
        `${srcDir}/**/*.json`,
        "package.json"
    ]).pipe(gulp.dest(`${compileDir}/src`));
});

gulp.task("typescript", ["copy"], () => {
    let tsProject = ts.createProject(`${srcDir}/app/tsconfig.json`);

    let tsResult = tsProject.src([
        `!${srcDir}/app/jspm_packages/**`
    ]).pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest(`${compileDir}/src/app`));
});

gulp.task("jspm", (cb) => {
    exec("jspm install", (err) => {
        cb(err);
    });
});

gulp.task("copy-typings", ["jspm"], () => {
    return gulp.src([`${srcDir}/app/jspm_packages/npm/aurelia*/*.d.ts`])
               .pipe(gulp.dest("./typings/"));
});

gulp.task("tsd-rebundle", ["copy-typings"], (cb) => {
    exec("tsd rebundle", (err) => {
        cb(err);
    });
});

gulp.task("update-aurelia", ["tsd-rebundle"]);

gulp.task("default", ["typescript"]);