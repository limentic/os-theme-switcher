import * as vscode from 'vscode';

export class Settings {
  public static get(param: string): string | undefined {
    let setting: string | undefined = vscode.workspace.getConfiguration('os-theme-switcher').get<string>(param);

    if (setting !== undefined && setting.length > 0) {
      return setting;
    }
    vscode.window.showErrorMessage(`[OS Theme Switcher] - Please set ${param} in settings.json !`);
    return undefined;
  }
}

