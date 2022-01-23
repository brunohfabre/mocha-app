const { contextBridge, ipcRenderer } = require('electron');

const api = {
  invoke(channel, args) {
    return ipcRenderer.invoke(channel, args);
  },
  sendSync() {
    return ipcRenderer.sendSync('synchronous-message', 'ping');
  },
  myPing() {
    ipcRenderer.send('ipc-example', 'ping');
  },
  on(channel, func) {
    const validChannels = ['ipc-example'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  once(channel, func) {
    const validChannels = ['ipc-example'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
};

contextBridge.exposeInMainWorld('electron', api);

module.exports = {
  api,
};
