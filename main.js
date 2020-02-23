// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

// 自定义窗口类，封装创建窗口的功能
class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true // 在应用程序中可以使用Node.js的API
      }
    };
    // const finalConfig = Object.assign(basicConfig, config)
    const finalConfig = { ...basicConfig, ...config };
    super(finalConfig);
    this.loadFile(fileLocation);
    // 优雅的显示窗口
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, addWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new AppWindow(
    {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true // 在应用程序中可以使用Node.js的API
      }
    },
    './renderer/index.html'
  );
  // 点击添加歌曲按钮，创建添加歌曲的窗口
  ipcMain.on('add-music-window', () => {
    addWindow = new AppWindow(
      {
        width: 500,
        height: 400,
        parent: mainWindow
      },
      './renderer/add.html'
    );
  });
  // 点击添加音乐按钮，创建文件选择对话框
  ipcMain.on('open-music-file', event => {
    dialog
      .showOpenDialog({
        title: '选择音乐',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Music', extensions: ['mp3'] }]
      })
      .then(result => {
        event.sender.send('selected-files', result.filePaths);
        // addWindow.webContents.send('selected-files', '2222222222222');
      })
      .catch(err => {
        console.log(err);
      });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
