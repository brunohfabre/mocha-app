import { api } from '../../main/preload';

declare global {
  // eslint-disable-next-line
  interface Window {
    electron: typeof api;
  }
}
