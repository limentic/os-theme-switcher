import * as vscode from 'vscode';
import * as fs from 'fs';
import { Settings } from './settings';

export class Switcher {
  public static async switchTheme(path: string): Promise<void | Error> {
    const data = await fs.promises.readFile(path, { encoding: 'utf8' });
    const light = Settings.get('lightTheme');
    const dark = Settings.get('darkTheme');

    if (data === 'light') {
      if (typeof light === 'string' && light !== '') {
        await this.switcher(light, 'light');
      } else {
        throw new Error('Please set the lightTheme in your settings.json !');
      }
    } else if (data === 'dark') {
      if (typeof dark === 'string' && dark !== '') {
        await this.switcher(dark, 'dark');
      } else {
        throw new Error('Please set the darkTheme in your settings.json !');
      }
    } else {
      throw new Error('Please relaunch VSCode, the daemon files have been tempered !');
    }
  }

  private static async switcher(theme: string, which: 'light' | 'dark'): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');

    if (config.get('colorTheme') !== theme) {
      await config.update('colorTheme', theme, vscode.ConfigurationTarget.Global);
      if (which === 'light') {
        vscode.window.showInformationMessage(`[OS Theme Switcher] - Switching vscode to your light theme...`);
      } else {
        vscode.window.showInformationMessage(`[OS Theme Switcher] - Switching vscode to your dark theme...`);
      }
    }
  }
}
