const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const menu = require('./menu');

let window;

app.on('ready', () => {

    window = new BrowserWindow({
        width: 800,
        height: 600,
        icon: __dirname + '/img/32x32.png',
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    splash = new BrowserWindow({ 
        width: 400, 
        height: 240,
        resizable: false, 
        frame: false, 
        alwaysOnTop: true 
    });

    splash.loadFile('splash.html');
    window.loadFile('index.html');

    setTimeout(() => {
        splash.destroy();
        window.show();
    }, 3000);

    autoUpdater.checkForUpdatesAndNotify();
});

Menu.setApplicationMenu(menu);