import Editor from './Editor.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Editor", () => {
    it('should create', () => {
        const { container } = render(Editor)
        expect(container).toBeTruthy();
    })
})