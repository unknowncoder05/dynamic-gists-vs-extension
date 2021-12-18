import { TestHoverProvider } from './testHovers';
import { PythonHoverProvider } from './python/provider';


export const hovers = {
	python: {
        selector: 'python',
        provider: PythonHoverProvider,
    },
	test: {
        selector: 'javascript',
        provider: TestHoverProvider,
    },
};