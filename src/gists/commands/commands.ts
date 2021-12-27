import { buildGistFile } from './buildFile';
import { buildGistProject } from './buildProject';
import { testCommand } from './testCommand';
import { pythonAddElseIfCommand, pythonAddElseCommand } from './python/logicCommands';
import { extensionName } from './../config';


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
    },
    pythonAddElse: {
        name: `${extensionName}.pythonAddElse`,
        function: pythonAddElseCommand,
    }
};