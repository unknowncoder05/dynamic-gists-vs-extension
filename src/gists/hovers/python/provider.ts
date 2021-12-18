import { HoverProvider, TextDocument, Position, CancellationToken, Hover } from 'vscode';
import { cases } from './cases/cases';

export class PythonHoverProvider implements HoverProvider{
	public provideHover(doc: TextDocument, position: Position, token: CancellationToken): Hover {
		const range = doc.getWordRangeAtPosition(position);
		const word = doc.getText(range);
		for(const caseIndex in cases){
			const codeCase = (cases as any)[caseIndex];
			if(codeCase.regex.test(word)){
				const content = codeCase.function(doc, position, token);
				return content;
			}
		}
		
		return new Hover('');
	}
}
