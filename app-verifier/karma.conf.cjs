// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-jasmine-diff-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("karma-mocha-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reports: ["lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 0,
        lines: 0,
        branches: 0,
        functions: 0,
      },
    },
    reporters: ["jasmine-diff", "mocha"],
    jasmineDiffReporter: {
      color: {
        expectedBg: "bgMagenta",
        expectedWhitespaceBg: "bgMagenta",
        actualBg: "bgBlue",
        actualWhitespaceBg: "bgBlue",
      },
      legacy: true,
    },
    mochaReporter: {
      output: "minimal",
    },
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    webpack: {
      node: {
        fs: "empty",
        child_process: "empty",
        readline: "empty",
      },
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
