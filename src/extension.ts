// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { types } from 'util';
import * as vscode from 'vscode';
import { commands as gistCommands } from './gists/commands/commands';
import { hovers as gistHovers } from './gists/hovers/hovers';
import { Command } from './types/command';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	
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
	
}
	  
export function deactivate() {}
