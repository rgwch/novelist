
import Modal from './Modal.svelte'
import { render } from '@testing-library/svelte'
import '../services/i18n/i18n'

describe("Modal box", () => {
  it('should create', () => {
    const { container } = render(Modal, { title: "Test Modal" })
    expect(container).toBeTruthy();
  })
})