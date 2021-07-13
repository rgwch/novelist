import Place from './Place.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Place", () => {
  it('should create', () => {
    const { container } = render(Place, { metadata: { name: "At home" } })
    expect(container).toBeTruthy();
  })
})