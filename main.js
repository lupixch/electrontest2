const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

require('electron-reload')(__dirname)

let getAppVersionString = function() {
    return app.getVersion()
}

let window = null

// Wait until the app is ready
app.once('ready', () => {
    // Create a new window
    window = new BrowserWindow({
        // Set the initial width to 800px
        width: 800,
        // Set the initial height to 600px
        height: 600,
        // Set the default background color of the window to match the CSS
        // background color of the page, this prevents any white flickering
        backgroundColor: '#D6D8DC',
        // Don't show the window until it's ready, this prevents any white flickering
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Load a URL in the window to the local index.html path
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Show window when page is ready
    window.once('ready-to-show', () => {
        window.setTitle('GC Helper V' + getAppVersionString())
        window.show()
    })

    // window.webContents.openDevTools()
})