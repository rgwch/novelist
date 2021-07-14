import Drop from './Dropdown.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'
import { listen } from 'jest-svelte-events'

const definition = {
    type: 'dings',
    newelem: 'new dings',
    promptname: 'new dings'
}
const meta = {
    dings: ['one', 'two', ' more']
}
describe("Dropdown", () => {
    it('should create', () => {
        const { container, component, getByDisplayValue } = render(Drop, { metadata: meta, definition })
        // listen(component, 'selected')
        expect(container).toBeTruthy();
        expect(getByDisplayValue("one")).toBeTruthy()
        // expect(component).toHaveFiredEvent('selected')
    })
})