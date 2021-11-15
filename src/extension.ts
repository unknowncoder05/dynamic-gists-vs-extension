// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileCompiler, ProjectCompiler, TestData } from 'dynamic-gists-client';
import path = require('path');
import fsLibrary = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const commandNames = {
	buildGistFile: "buildGistFile",
	buildGistProject: "buildGistProject"
};

const extensionName = "dynacmic-gists-js";

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
		
		const fileCompiler = new FileCompiler({
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
			const projectCompiler = new ProjectCompiler({
				project: JSON.parse(activeEditor.document.getText()),
				projectPath: path.dirname(activeEditor.document.fileName),
				readJsonFromFile: readJsonFromFileVSC
			});
			const compiledFiles = await projectCompiler.compile();
			for(const compiledFile of compiledFiles){
				saveCompiledFile(compiledFile);
			}
		} catch(err){
			console.error("caught err",err);
		}
		
		
	}
}

export function activate(context: vscode.ExtensionContext) {
	
	context.subscriptions.push(vscode.commands.registerCommand(
		`${extensionName}.${commandNames.buildGistFile}`,
		buildGistFile
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		`${extensionName}.${commandNames.buildGistProject}`,
		buildGistProject
	));
}

export function deactivate() {}
