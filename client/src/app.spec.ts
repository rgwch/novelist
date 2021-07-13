/**
 * @jest-environment jsdom
 */

import App from './App.svelte'
import { render } from '@testing-library/svelte';
import './lib/services/i18n/i18n'

describe('Chapter Component', () => {
  it('Should create', () => {
    const { container } = render(App);

    expect(container).toBeTruthy();
  });
});

