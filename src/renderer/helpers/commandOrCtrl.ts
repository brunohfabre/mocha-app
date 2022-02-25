export const commandOrCtrl = () =>
  window.navigator.platform.match(/^Mac/) ? 'command' : 'ctrl';
