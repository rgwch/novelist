
import Modal from './Modal.svelte'
import { render } from '@testing-library/svelte'

describe("Modal box", () => {
    it('should create', () => {
        const { container } = render(Modal)
        expect(container).toBeTruthy();
    })
})