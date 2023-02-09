import type { MenuDef } from './lib/widgets/Popup.svelte'
import { _ } from 'svelte-i18n'
let $_
_.subscribe(n => { $_ = n })


const fileMenu: Array<MenuDef> = [
    {
        name: 'menuChangepwd',
        label: $_('actions.changePWD'),
    },
    {
        name: 'menuGeneratehtml',
        label: $_('actions.generateHTML'),
    },
    {
        name: 'menuGenerateepub',
        label: $_('actions.generateEPUB'),
    },
    {
        name: 'menuCheck',
        label: $_('actions.check'),
    },
    {
        name: 'menuClose',
        label: $_('actions.close'),
    },
];
const displayMenu: Array<MenuDef> = [
    {
        name: 'menuBook',
        label: $_('book.metadata'),
    },
    {
        name: 'menuChapter',
        label: $_('book.chapter'),
    },
    {
        name: 'menuPersons',
        label: $_('book.persons'),
    },
    {
        name: 'menuPlaces',
        label: $_('book.places'),
    },
    {
        name: 'menuNotes',
        label: $_('book.notes'),
    },
    {
        name: 'menuTimeline',
        label: $_('book.timeline'),
    },
];
export default [
    { name: fileMenu, label: $_('menu.file') },
    { name: displayMenu, label: $_('menu.display') },
];