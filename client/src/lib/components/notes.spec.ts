import Notes from './Notes.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Notes", () => {
    it('should create', () => {
        const { container } = render(Notes)
        expect(container).toBeTruthy();
    })
})