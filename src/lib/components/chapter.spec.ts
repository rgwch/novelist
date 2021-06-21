/**
 * @jest-environment jsdom
 */

import Chapter from './Chapter.svelte'
import { render } from '@testing-library/svelte';

xdescribe('Chapter Component', () => {
  it('Should create', () => {
    const { container } = render(Chapter);

    expect(container).toBeTruthy();
  });
});

