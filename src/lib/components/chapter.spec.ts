/**
 * @jest-environment jsdom
 */

import Chapter from './Chapter.svelte'
import { render } from '@testing-library/svelte';

describe('Chapter Component', () => {
  it('Should create', () => {
    const { container } = render(Chapter);

    expect(container).toBeTruthy();
  });
});

