const fs = require('fs');
const {
    app,
    Menu,
    shell,
    ipcMain,
    BrowserWindow,
    globalShortcut,
    dialog
} = require('electron');

function saveFile() {
    //console.log('Saving the file');
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
}

async function loadFile() {
    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Pick a markdown file',
        filters: [
            { name: 'Markdown files', extensions: ['md'] },
            { name: 'Text files', extensions: ['txt'] }
        ]
    };

    const file = await dialog.showOpenDialog(window, options);

    if (file) {
        //console.log(`Opening content from the file: ${file.filePaths}`);
        const content = fs.readFileSync(`${file.filePaths}`).toString();            
        window.webContents.send('load', content);
    }
}

app.on('ready', () => {
    globalShortcut.register('CommandOrControl+S', () => {
        saveFile();
    });

    globalShortcut.register('CommandOrControl+O', () => {
        loadFile();
    });
});

ipcMain.on('save', async(event, arg) => {

    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save markdown file',
        filters: [{
            name: 'MyFile',
            extensions: ['md']
        }]
    };

    const file = await dialog.showSaveDialog(window, options);

    if (file) {
        //console.log(`Saving content to the file: ${file.filePath}`);
        fs.writeFileSync(file.filePath, arg);
    }

});

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});


const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CommandOrControl+O',
                click() { loadFile(); }
            },
            {
                label: 'Save',
                accelerator: 'CommandOrControl+S',
                click() { saveFile(); }
            }
        ]
    },
    {
        label: 'Format',
        submenu: [{
                label: 'Toggle Bold',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event', 'toggle-bold');
                }
            },
            {
                label: 'Toggle Italic',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event', 'toggle-italic');
                }
            },
            {
                label: 'Toggle Strikethrough',
                click() {
                    const window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('editor-event', 'toggle-strikethrough');
                }
            }
        ]
    },
    {
        role: 'help',
        submenu: [{
            label: 'About Editor Component',
            click() {
                shell.openExternal('https://simplemde.com/');
            }
        }]
    }
];

if (process.env.DEBUG) {
    template.push({
        label: 'Debugging',
        submenu: [{
                label: 'Dev Tools',
                role: 'toggleDevTools'
            },
            { type: 'separator' },
            {
                role: 'reload',
                accelerator: 'Alt+R'
            }
        ]
    });
}

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });
}


const menu = Menu.buildFromTemplate(template);

module.exports = menu;