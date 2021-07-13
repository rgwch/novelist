import Person from './Person.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Person", () => {
  it('should create', () => {
    const { container } = render(Person, { metadata: { name: "Peter" } })
    expect(container).toBeTruthy();
  })
})