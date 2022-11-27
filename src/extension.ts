import { Daemon } from './daemon';
import { Settings }from './settings';

export async function activate() {
  const path = Settings.get('daemonFolderPath');
  const light = Settings.get('lightTheme');
  const dark = Settings.get('darkTheme');

  if (path && light && dark) {
    Daemon.start(path);
  }
}

export function deactivate() {
  Daemon.stop();
}
