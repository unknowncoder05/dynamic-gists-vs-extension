import { TextDocument, Position, CancellationToken, Hover, MarkdownString, Uri } from 'vscode';
import { commands } from './../../../commands/commands';


export function ifHandler(doc: TextDocument, position: Position, token: CancellationToken): Hover{
    console.log('if handler');
    
    const commentCommandUri = Uri.parse(`command:${commands.pythonAddElseIf.name}}`);
    console.log(commentCommandUri);
    const contents = new MarkdownString(`[Add Else If](${commentCommandUri})`);
    contents.isTrusted = true;
    return new Hover(contents);
}