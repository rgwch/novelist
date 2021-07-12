/**
 * @jest-environment jsdom
 */

 import Chapter from './Chapter.svelte'
 import { render } from '@testing-library/svelte';
 import '../services/i18n/i18n'
 
 xdescribe('Chapter Component', () => {
   it('Should create', () => {
     const { container } = render(Chapter);
 
     expect(container).toBeTruthy();
   });
 });
 
 