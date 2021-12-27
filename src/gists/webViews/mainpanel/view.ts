import { ViewColumn, CancellationToken, Disposable, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window, workspace, extensions, commands } from "vscode";

export async function mainPanelCommand(){
    const panel = window.createWebviewPanel(
        MainPanelView.viewType, // Identifies the type of the webview. Used internally
        MainPanelView.title, // Title of the panel displayed to the user
        ViewColumn.One, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later. 
      );
    // panel.webview.html = getWebviewContent();
}

// Author: https://github.com/estruyf
export class MainPanelView implements WebviewViewProvider, Disposable {
    public static readonly viewType = "mainPanelView";
    public static readonly title = "DynamicGists";
    public static readonly stylesLocation = "resources/media/styles.css";
    public static readonly scriptLocation = "dist/mainpanel.js";
    private static instance: MainPanelView;
  
    private panel: WebviewView | null = null;
    private disposable: Disposable | null = null;
    private panelActions: any = null;
  
    private constructor(private readonly extPath: Uri) {}
  
    /**
     * Creates the singleton instance for the panel
     * @param extPath 
     */
    public static getInstance(extPath?: Uri): MainPanelView {
      if (!MainPanelView.instance) {
        MainPanelView.instance = new MainPanelView(extPath as Uri);
      }
  
      return MainPanelView.instance;
    }
  
    /**
     * Retrieve the visibility of the webview
     */
    get visible() {
          return this.panel ? this.panel.visible : false;
    }
    
    /**
     * Webview panel dispose
     */
    public dispose() {
          if (this.disposable) {
        this.disposable.dispose();
      } 
    }
  
    /**
     * Default resolve webview panel
     * @param webviewView 
     * @param context 
     * @param token 
     */
    public async resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext, token: CancellationToken): Promise<void> {
      this.panel = webviewView;
  
      webviewView.webview.options = {
        enableScripts: true,
        enableCommandUris: true,
        localResourceRoots: [this.extPath]
      };
      
      webviewView.webview.html = this.getWebviewContent(webviewView.webview);
  
      this.disposable = Disposable.from(
              webviewView.onDidDispose(() => { webviewView.webview.html = ""; }, this),
      );
  
      // webviewView.onDidChangeVisibility(async () => {
      //   if (this.visible) {
      //     await this.getSettings();
      //   }
      // });
  
      window.onDidChangeActiveTextEditor(async () => {
        await this.getSettings();
      }, this);
  
      webviewView.webview.onDidReceiveMessage(msg => {
        switch (msg.command) {
          case 'trigger':
            if (!!msg.data.data) {
              commands.executeCommand(msg.data.command, msg.data.data);
            } else {
              commands.executeCommand(msg.data.command);
            }
            return;
          case 'getSettings':
            this.getSettings();
            return;
          default:
            return;
        }
      });
    }
  
  
    /**
     * Retrieve the extension settings
     */
    private async getSettings() {
      this.panelActions = [];
  
      const allExtensions = extensions.all.filter(e => !e.id.startsWith('vscode') && !e.id.startsWith('ms-vscode'));
  
      for await (const ext of allExtensions) {
        try {
          const values = await commands.executeCommand(`${ext.id}.panel.registration`);
  
          this.panelActions.push(values);
        } catch (e) {
          // The extension does not have a panel registration
        }
      }
  
      const total = this.panelActions.length;
      this.panel!.title = `${total} Connection${total === 1 ? '' : 's'}`;
  
      this.panel!.webview.postMessage({
        command: 'settings',
        data: this.panelActions
      });
    }
  
  
    private getNonce() {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
  
    /**
     * Retrieve the webview HTML contents
     * @param webView 
     */
    private getWebviewContent(webView: Webview): string {
      const stylesUri = webView.asWebviewUri(Uri.joinPath(this.extPath, 'assets/media', 'styles.css'));//webView.asWebviewUri(Uri.joinPath(this.extPath, Object.getPrototypeOf(this).stylesLocation));
      const scriptUri = webView.asWebviewUri(Uri.joinPath(this.extPath, 'dist', 'mainpanel.js'));//webView.asWebviewUri(Uri.joinPath(this.extPath, Object.getPrototypeOf(this).scriptLocation));
      const nonce = this.getNonce();
  
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webView.cspSource} 'self' 'unsafe-inline'; script-src 'nonce-${nonce}'; style-src ${webView.cspSource} 'self' 'unsafe-inline'; font-src ${webView.cspSource};">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${stylesUri}" rel="stylesheet">
          <title>${Object.getPrototypeOf(this).title}</title>
        </head>
        <body style="padding:0">
          <div id="app"></div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
      `;
    }
  }