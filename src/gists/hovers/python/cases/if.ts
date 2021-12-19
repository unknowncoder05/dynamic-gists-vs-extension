import { TextDocument, Position, CancellationToken, Hover, MarkdownString, Uri } from 'vscode';
import { commands } from './../../../commands/commands';


export function ifHandler(doc: TextDocument, position: Position, token: CancellationToken): Hover{
    const args = [{ codeLine: position.line }];
    const pythonAddElseIfCommandUri = Uri.parse(`command:${commands.pythonAddElseIf.name}?${encodeURIComponent(JSON.stringify(args))}`);
    const pythonAddElseCommandUri = Uri.parse(`command:${commands.pythonAddElse.name}?${encodeURIComponent(JSON.stringify(args))}`);
    const contents = new MarkdownString(`[Add Else If](${pythonAddElseIfCommandUri}) | [Add Else](${pythonAddElseCommandUri})`);
    contents.isTrusted = true;
    return new Hover(contents);
}