import express from 'express';
import ServerController from './server-controller.js';

export default class ServerRoutes {
  static initRouter() {
    const router = express.Router();
    const serverController = new ServerController();
    router.post('/docx/checkDifference', serverController.checkFiles);
    router.post('/docx/validate', serverController.validate);
    router.post('/docx/convertDocX', serverController.convertDocx);
    router.get('/docx/getDiffImage', serverController.getDiffImage);
    router.get('/docx/getImage', serverController.getImage);
    router.get('/docx/getDiffImageStream', serverController.getDiffImageStream);
    router.get('/', serverController.getIndexPage);
    router.get('/help', serverController.getHelpPage);
    router.get('/ping', serverController.testCall);
    console.log('Router has initd');
    return router;
  }
}
