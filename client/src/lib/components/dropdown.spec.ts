import Drop from './Dropdown.svelte'
import { render } from '@testing-library/svelte'

describe("Dropdown", () => {
    it('should create', () => {
        const { container } = render(Drop)
        expect(container).toBeTruthy();
    })
})