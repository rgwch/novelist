import Menu from './Modal.svelte'
import { render } from '@testing-library/svelte'

describe("Menu", () => {
    it('should create', () => {
        const { container } = render(Menu)
        expect(container).toBeTruthy();
    })
})