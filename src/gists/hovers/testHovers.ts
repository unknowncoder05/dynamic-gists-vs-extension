import { HoverProvider, TextDocument, Position, CancellationToken, Hover, MarkdownString, Uri } from 'vscode';
import { commands } from '../commands/commands';

export class TestHoverProvider implements HoverProvider{
	public provideHover(doc: TextDocument, position: Position, token: CancellationToken): Hover {
		const commentCommandUri = Uri.parse(`command:${commands.test.name}}`);
		const commentCommandUri2 = Uri.parse(`command:editor.action.addCommentLine`);
		const contents = new MarkdownString(`[Test](${commentCommandUri}) [Add comment](${commentCommandUri2})`);
		contents.isTrusted = true;
		const range = doc.getWordRangeAtPosition(position);
		const word = doc.getText(range);
		return new Hover(contents);
	}
}