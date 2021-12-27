import { window } from 'vscode';
import { webViews as gistWebViews } from '../../gists/webViews/webViews';


export function testCommand(){
    window.showInformationMessage(`Test Command ->${gistWebViews}`);
    for(const webViewName in gistWebViews){
		const webView = (webViewName as any)[webViewName];
        window.showInformationMessage(webViewName, webView);
		console.log('webView', webViewName, webView);
	}
}