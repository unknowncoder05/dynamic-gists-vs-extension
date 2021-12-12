// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PythonCompiler } from 'dynamic-gists-client';
import path = require('path');
import fsLibrary = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const extensionName = "dynacmic-gists-js";

const commandNames = {
	buildGistFile: `${extensionName}.buildGistFile`,
	buildGistProject: `${extensionName}.buildGistProject`,
	test: `${extensionName}.Test`

};

function saveCompiledFile(compiledFile:any){
	fsLibrary.writeFile(
		path.join(compiledFile.filePath),
		compiledFile.content,
		()=>{
			console.log("created file", compiledFile.filePath);
			vscode.window.showInformationMessage('Created new file '+ compiledFile.filePath);
		}
	);
}

async function buildGistFile(newFilePath?:string){
	const activeEditor = vscode.window.activeTextEditor;
	if(activeEditor){
		let newCompiledFilePath = newFilePath ? newFilePath: activeEditor.document.fileName;
		
		const fileCompiler = new PythonCompiler.FileCompiler({
			block: JSON.parse(activeEditor.document.getText()),
			args: {},
			baseRoute: newCompiledFilePath,
			readJsonFromFile: readJsonFromFileVSC,
		});
		const compiledFile = await fileCompiler.compile();
		saveCompiledFile(compiledFile);
	}
}

async function readJsonFromFileVSC(path:string){
	let document = await vscode.workspace.openTextDocument(vscode.Uri.file(path));
	let parsedJson = JSON.parse(document.getText());
	return parsedJson;
}

async function buildGistProject(){
	const activeEditor = vscode.window.activeTextEditor;
	if(activeEditor){
		try{
			const projectCompiler = new PythonCompiler.ProjectCompiler({
				project: JSON.parse(activeEditor.document.getText()),
				projectPath: path.dirname(activeEditor.document.fileName),
				readJsonFromFile: readJsonFromFileVSC
			});
			console.log("projectCompiler", projectCompiler);
			const compiledFiles = await projectCompiler.compile();
			console.log("compiledFiles", compiledFiles);
			for(const compiledFile of compiledFiles){
				saveCompiledFile(compiledFile);
			}
		} catch(err){
			console.error("caught err",err);
		}
	}
}

class TestHoverProvider implements vscode.HoverProvider{
	public provideHover(doc: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.Hover {
		const commentCommandUri = vscode.Uri.parse(`command:${commandNames.test}`);
		const commentCommandUri2 = vscode.Uri.parse(`command:editor.action.addCommentLine`);
		const contents = new vscode.MarkdownString(`[Test](${commentCommandUri}) [Add comment](${commentCommandUri2})`);
		contents.isTrusted = true;
		const range = doc.getWordRangeAtPosition(position);
		const word = doc.getText(range);
		return new vscode.Hover(contents);
	}
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerHoverProvider(
		'javascript', new TestHoverProvider()
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		commandNames.buildGistFile,
		buildGistFile
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		commandNames.buildGistProject,
		buildGistProject
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		commandNames.test,
		() => vscode.window.showInformationMessage('Test Command')
	));
	
}
	  
export function deactivate() {}
