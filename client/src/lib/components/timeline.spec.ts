import Timeline from './Timeline.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Place", () => {
    it('should create', () => {
        const { container } = render(Timeline)
        expect(container).toBeTruthy();
    })
})