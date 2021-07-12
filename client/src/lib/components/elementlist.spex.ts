import El from './Elementlist.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Element List", () => {
    it('should create', () => {
        const { container } = render(El)
        expect(container).toBeTruthy();
    })
})