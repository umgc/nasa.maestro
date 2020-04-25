import awilix, { AwilixContainer } from 'awilix';
// @ts-ignore
import CheckerService from './checker-service.js';
import DocXValidatorService from './docx-validator.js';
import spawn from 'child_process';
//import PDFImage from 'pdf-image';
import Common from './common.js';
import Unoconv from 'unoconv-promise';

export default class IOC {
  static container: AwilixContainer;

  static initContainer(): void {
    IOC.container = awilix.createContainer({
      injectionMode: awilix.InjectionMode.PROXY,
    });

    IOC.container.register({
      common: awilix.asClass(Common),
      checkService: awilix.asClass(CheckerService),
      docXService: awilix.asClass(DocXValidatorService),
      //pdf2imageService: awilix.asValue(PDFImage),
      unoconv: awilix.asValue(Unoconv),
      spawn: awilix.asValue(spawn),
    });
    console.log('IOC has initd');
  }
}
