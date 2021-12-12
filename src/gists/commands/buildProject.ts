import {saveCompiledFile, readJsonFromFileVSC} from './../utils';
import { window } from 'vscode';
import { PythonCompiler } from 'dynamic-gists-client';
import path = require('path');

export async function buildGistProject(){
	const activeEditor = window.activeTextEditor;
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