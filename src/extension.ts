// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commands as gistCommands } from './gists/commands/commands';
import { hovers as gistHovers } from './gists/hovers/hovers';
import { webViews as gistWebViews } from './gists/webViews/webViews';
import { Command } from './types/command';


export function activate(context: vscode.ExtensionContext) { // TODO: replace to '{ subscriptions, extensionUri }: vscode.ExtensionContext'
	
	for(const commandIndex in gistCommands){
		const command = (gistCommands as any)[commandIndex];
		context.subscriptions.push(vscode.commands.registerCommand(
			command.name,
			command.function
		));
	}

	for(const hoverIndex in gistHovers){
		const hover = (gistHovers as any)[hoverIndex];
		context.subscriptions.push(vscode.languages.registerHoverProvider(
			hover.selector,
			new hover.provider()
		));
	}

	for(const webViewName in gistWebViews){
		const webView = (gistHovers as any)[webViewName];
		const webViewInstance = webView.view.getInstance(context.extensionUri);
		let webViewRegistered = vscode.window.registerWebviewViewProvider(webView.type, webViewInstance, {
			webviewOptions: {
				retainContextWhenHidden: true
			}
		});
		context.subscriptions.push(webViewRegistered);
	}
}
	  
export function deactivate() {}
