import { window } from 'vscode';
import {saveCompiledFile, readJsonFromFileVSC} from './../utils';
import { PythonCompiler } from 'dynamic-gists-client';

export async function buildGistFile(newFilePath?:string){
	const activeEditor = window.activeTextEditor;
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