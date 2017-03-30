(function () {
  'use strict';

  const electron = require('electron');
  const app = electron.app;
  const BrowserWindow = electron.BrowserWindow;
  const client = require('electron-connect').client;
  const config = require('./polyonic.config');

  const express = require('express');
  const path = require('path');
  const logger = require('morgan');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const skipMap = require('skip-map');
  const expressApp = express();
  const debug = require('debug')('express-test:server');
  const http = require('http');
  const port = process.env.PORT || '3000';

  let server;

  function onListening () {
    let addr = server.address();
    let bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
    debug('Listening on ' + bind);

    mainWindow.loadURL('http://127.0.0.1:3000');

        // Use Electron Connect when developing for live reloading, and show the devtools
    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools();
      client.create(mainWindow);
    };

    if(config.debug.devTools) {
      mainWindow.openDevTools();
    }
  }

  let mainWindow = null;

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin' || config.platform.macos.autoClose === true) {
      app.quit();
    }
  });

  app.on('ready', function () {
    mainWindow = new BrowserWindow({
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      },
      width: config.windows.default.width,
      height: config.windows.default.height,
      fullscreen: config.windows.default.fullscreen,
      resizable: config.windows.default.resizeable
    });

    expressApp.use(skipMap());
    expressApp.use(express.static(path.join(__dirname, 'www')));
    expressApp.use(express.static(path.join(__dirname, 'node_modules')));
    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use(cookieParser());
    expressApp.set('port', port);
    expressApp.get('/', function (req, res) {
      res.sendFile(path.join(path.join(__dirname, '/index.html')));
    })

    server = http.createServer(expressApp);
    server.listen(port);
    server.on('listening', onListening);

    mainWindow.on('closed', function () {
      mainWindow = null;
      server.close();
    });
  });
}());
