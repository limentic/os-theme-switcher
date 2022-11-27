import * as vscode from 'vscode';
import * as fs from 'fs';
import { join } from 'path';
import * as os from 'os';
import * as chokidar from 'chokidar';
import { spawn } from 'child_process';
import { Switcher } from './switcher';

export class Daemon {
  static instance: Daemon;
  private controller: AbortController | undefined;

  private constructor(path: string) {
    this.daemonStart(path);
  }

  public static start(path: string): void {
    if (!Daemon.instance) {
      Daemon.instance = new Daemon(path);
    }
  }

  public static stop(): void {
    if (Daemon.instance) {
      Daemon.instance.daemonStop();
    }
  }

  private async daemonStart(path: string): Promise<void> {
    if (path.startsWith('~') || path === '~') {
      path = path.replace('~', os.homedir());
    }

    try {
      await fs.promises.access(path);

      const pathProcess = join(path, 'os-theme-switcher');
      await fs.promises.access(pathProcess);

      const pathTheme = join(path, 'current-theme');

      this.controller = new AbortController();
      const { signal } = this.controller;

      const process = spawn(pathProcess, { signal });

      process.on('error', (err) => {
        throw new Error(err.message);
      });

      const watcher = chokidar.watch(pathTheme, { persistent: true });
      await Switcher.switchTheme(pathTheme);
      watcher.on('change', async (pathTheme) => {
        await Switcher.switchTheme(pathTheme);
      });
    } catch (err) {
      vscode.window.showErrorMessage(`[OS Theme Switcher] - Something went wrong (${err})`);
      this.daemonStop();
    }
  }

  private daemonStop(): void {
    if (this.controller) {
      this.controller.abort();
    }
  }
}