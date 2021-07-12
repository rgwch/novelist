import Book from './Book.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Book", () => {
    it('should create', () => {
        const { container } = render(Book)
        expect(container).toBeTruthy();
    })
})