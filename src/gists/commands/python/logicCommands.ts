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
    const initialSpacing = getTextTabulation(initialLineContent);
    let blockEndLine = -1;
    let subBlocks:string[][] = [[]];
    for(let i = startLine+1; i < initialLineCount; i++){
        const currentLineContent = activeEditor.document.lineAt(i).text;
        const currentInitialSpacing = getTextTabulation(currentLineContent);
        console.log('-----------------------------------------');
        console.log('currentLineContent', currentLineContent);
        console.log('currentInitialSpacing', currentInitialSpacing);
        console.log('initialSpacing', initialSpacing);
        console.log('subBlocks', subBlocks);
        if(initialSpacing === currentInitialSpacing){
            if(/else\s?:*$/.test(currentLineContent) || /elif.*:.*$/.test(currentLineContent)){
                console.log('is else if or else');
                subBlocks.push([currentLineContent]);
                continue;
            }
            if(/[^\s]+$/.test(currentLineContent)){
                console.log('is an other block');
                blockEndLine = i;
                break;
            }
        }
        if(initialSpacing > currentInitialSpacing){
            console.log('is end of block');
            blockEndLine = i;
            break;
        }
        subBlocks[subBlocks.length-1].push(currentLineContent);
    } 
    if(blockEndLine === -1){
        blockEndLine = initialLineCount+1;
    }
    console.log('>---------------------------------------<');
    return {
        subBlocks,
        blockEndLine,
        editorTabSize,
        initialSpacing,
    };
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
    const ifBlock = getElseIfBlock(activeLine, activeEditor);
    console.log('ifBlock', ifBlock);
    await activeEditor.edit((editBuilder: TextEditorEdit) => {
        editBuilder.insert(
            new Position(ifBlock.blockEndLine-1, ifBlock.subBlocks.slice(-1)[0].slice(-1)[0].length),
            `\n${' '.repeat(ifBlock.initialSpacing)}elif True:\n${' '.repeat(ifBlock.initialSpacing+ifBlock.editorTabSize)}pass`
        );
    });
    return;
}