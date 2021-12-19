import { window, TextEditorEdit, Position, TextEditor} from 'vscode';

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

function getElseIfBlock(startLine:number, activeEditor: TextEditor): any{
    const initialLineCount = activeEditor.document.lineCount;
    const editorTabSize = 4;
    const initialLineContent = activeEditor.document.lineAt(startLine).text;
    if(!/if/.test(initialLineContent)){
        // TODO: let user know this is not a valid line
        return;
    }
    const initialSpacing = getTextTabulation(initialLineContent);
    let blockEndLine = -1;
    let subBlocks:any[][] = [[]]; // TODO: create interface
    for(let i = startLine+1; i < initialLineCount; i++){
        const currentLineContent = activeEditor.document.lineAt(i).text;
        const currentInitialSpacing = getTextTabulation(currentLineContent);
        if(initialSpacing === currentInitialSpacing){
            if(/else\s?:*$/.test(currentLineContent) || /elif.*:.*$/.test(currentLineContent)){
                subBlocks.push([{
                    content:currentLineContent,
                    line: i
                }]);
                continue;
            }
            if(/[^\s]+$/.test(currentLineContent)){
                blockEndLine = i;
                break;
            }
        }
        if(initialSpacing > currentInitialSpacing){
            blockEndLine = i;
            break;
        }
        subBlocks[subBlocks.length-1].push({
            content:currentLineContent,
            line: i
        });
    } 
    if(blockEndLine === -1){
        blockEndLine = initialLineCount+1;
    }
    return {
        subBlocks,
        blockEndLine,
        editorTabSize,
        initialSpacing,
    };
}

export async function pythonAddElseIfCommand(args:any) {
    const activeEditor = window.activeTextEditor;
    if (!activeEditor) {
        return;
    }
    let activeLine = args.codeLine ? parseInt(args.codeLine) :activeEditor.selection.active.line;
    
    const ifBlock = getElseIfBlock(activeLine, activeEditor);
    await activeEditor.edit((editBuilder: TextEditorEdit) => {
        const firstSubBlock = ifBlock.subBlocks[0].slice(-1)[0];
        editBuilder.insert(
            new Position(firstSubBlock.line, firstSubBlock.content.length),
            `\n${' '.repeat(ifBlock.initialSpacing)}elif True:\n${' '.repeat(ifBlock.initialSpacing+ifBlock.editorTabSize)}pass`
        );
    });
    // TODO: set text selection at the 'True' word so that users can instantly edit
    return;
}

export async function pythonAddElseCommand(args:any) {
    const activeEditor = window.activeTextEditor;
    if (!activeEditor) {
        return;
    }
    let activeLine = args.codeLine ? parseInt(args.codeLine) :activeEditor.selection.active.line;
    
    const ifBlock = getElseIfBlock(activeLine, activeEditor);
    await activeEditor.edit((editBuilder: TextEditorEdit) => {
        // TODO: check if else block already exists and alert user
        editBuilder.insert(
            new Position(ifBlock.blockEndLine-1, ifBlock.subBlocks.slice(-1)[0].slice(-1)[0].content.length),
            `\n${' '.repeat(ifBlock.initialSpacing)}else:\n${' '.repeat(ifBlock.initialSpacing+ifBlock.editorTabSize)}pass`
        );
    });
    // TODO: set text selection at the 'True' word so that users can instantly edit
    return;
}