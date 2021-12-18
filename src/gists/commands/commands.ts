import { buildGistFile } from './buildFile';
import { buildGistProject } from './buildProject';
import { testCommand } from './testCommand';
import { pythonAddElseIfCommand } from './python/logicCommands';

export const extensionName = "dynacmic-gists-js";

export const commands = {
	buildGistFile: {
        name: `${extensionName}.buildGistFile`,
        function: buildGistFile,
    },
	buildGistProject: {
        name: `${extensionName}.buildGistProject`,
        function: buildGistProject,
    },
	test: {
        name: `${extensionName}.test`,
        function: testCommand,
    },
    pythonAddElseIf: {
        name: `${extensionName}.pythonAddElseIf`,
        function: pythonAddElseIfCommand,
    }

};