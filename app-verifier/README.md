![NASA Verifier TEST](https://github.com/umgc/nasa.maestro/workflows/Test%20and%20Code%20Coverage%20NASA%20Maestro%20Verifier/badge.svg)
![NASA Verifier CI](https://github.com/umgc/nasa.maestro/workflows/Deploy%20Dev%20NASA%20Maestro%20Verifier/badge.svg)
![NASA Verifier CD](https://github.com/umgc/nasa.maestro/workflows/Deploy%20Dev%20NASA%20Maestro%20Verifier/badge.svg)
![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=umgc.nasa.maestro.verifier&metric=coverage)

![Sonarcloud Quality](https://sonarcloud.io/api/project_badges/quality_gate?project=umgc.nasa.maestro.verifier)

# NASA MFTT CI/CD

This project is mono repo that contains both frontend client and backend server located in the respective directory.

## Test and Staging

The application has automated testing hosted through Github Actions ... see .github/workflows for workflow actions.

For Code Coverage Report view [Sonar Dashboard](https://sonarcloud.io/dashboard?id=umgc.nasa.maestro.verifier)

The project is staged at

- [NASA Maestro Verifier Staging](https://appdev-nasa-maestro-verifier.herokuapp.com/)

## Publishing and Storage

Merging to the release branch with a version tag:

stores the image to the [Capstone DockerHub](https://hub.docker.com/u/umgccaps)
publishes the application to the [NASA Maestro Verifier](https://app-nasa-maestro-verifier.herokuapp.com/)

# NASA MFTT Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
