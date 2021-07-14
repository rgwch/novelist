import Menu from './Menu.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Menu", () => {
    it('should create', () => {
        const { container } = render(Menu)
        expect(container).toBeTruthy();
    })
})