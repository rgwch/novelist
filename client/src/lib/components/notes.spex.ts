import Notes from './Notes.svelte'
import { render } from '@testing-library/svelte'

describe("Notes", () => {
    it('should create', () => {
        const { container } = render(Notes)
        expect(container).toBeTruthy();
    })
})