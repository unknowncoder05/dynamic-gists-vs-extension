import fsLibrary = require('fs');
import { window, workspace, Uri } from 'vscode';
import path = require('path');


export function saveCompiledFile(compiledFile:any){
	fsLibrary.writeFile(
		path.join(compiledFile.filePath),
		compiledFile.content,
		()=>{
			console.log("created file", compiledFile.filePath);
			window.showInformationMessage('Created new file '+ compiledFile.filePath);
		}
	);
}

export async function readJsonFromFileVSC(path:string){
	let document = await workspace.openTextDocument(Uri.file(path));
	let parsedJson = JSON.parse(document.getText());
	return parsedJson;
}