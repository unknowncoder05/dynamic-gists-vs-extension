// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { types } from 'util';
import * as vscode from 'vscode';
import { commands as gistCommands } from './gists/commands/commands';
import { Command } from './types/command';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	/*context.subscriptions.push(vscode.languages.registerHoverProvider(
		'javascript', new TestHoverProvider()
	));*/
	
	const commands = gistCommands;
	for(const commandIndex in commands){
		const command = (commands as any)[commandIndex];
		context.subscriptions.push(vscode.commands.registerCommand(
			command.name,
			command.function
		));
	}
	
}
	  
export function deactivate() {}
