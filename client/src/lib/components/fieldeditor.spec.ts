import Fe from './Fieldeditor.svelte'
import { render } from '@testing-library/svelte'

describe("Fieldeditor", () => {
    it('should create', () => {
        const { container } = render(Fe)
        expect(container).toBeTruthy();
    })
})