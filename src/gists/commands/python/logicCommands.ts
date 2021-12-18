import { window, TextEditorEdit, Position} from 'vscode';

function getTextTabulation(text:string): number{
    let result = 0;
    for (var x = 0; x < text.length; x++) {
        var c = text.charAt(x);
        if(c !== ' '){
            break;
        }
        result++;
    }
    return result;
}

export async function pythonAddElseIfCommand() {
    const activeEditor = window.activeTextEditor;
    if (!activeEditor) {
        return;
    }
    const activeLine = activeEditor.selection.active.line;
    const activeLineContent = activeEditor.document.lineAt(activeLine).text;
    if(!/if/.test(activeLineContent)){
        // TODO: let user know this is not a valid line
        return;
    }
    let initialSpacing = -1;
    const initialLineCount = activeEditor.document.lineCount;
    const editorTabSize = 4;
    for(let i = activeLine+1; i < initialLineCount; i++){
        const currentLineContent = activeEditor.document.lineAt(i).text;
        const currentinitialSpacing = getTextTabulation(currentLineContent);
        if(initialSpacing === -1){
            initialSpacing = currentinitialSpacing;
        }
        if(initialSpacing !== currentinitialSpacing && initialSpacing > currentinitialSpacing){
            await activeEditor.edit((editBuilder: TextEditorEdit) => {
                // TODO: there are different spacing types, make sure to make this code dynamic for any valid combination
                editBuilder.insert(new Position(i, 0), `\n${' '.repeat(initialSpacing-editorTabSize)}elif True:\n${' '.repeat(i+1)}pass\n`);
            });
            return;
        }
    }
    await activeEditor.edit((editBuilder: TextEditorEdit) => {
        editBuilder.insert(new Position(initialLineCount+1, 0), `\n${' '.repeat(initialSpacing-editorTabSize)}elif True:\n${' '.repeat(initialSpacing)}pass\n`);
    });
    return;
}