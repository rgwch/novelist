<script lang="ts">
    // import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
    import { currentBook } from '../services/store';
    import { _ } from 'svelte-i18n';
    import Chapters from './Chapters.svelte';
    import Book from './Book.svelte';
    import Person from './Person.svelte';
    import Place from './Place.svelte';
    import Timeline from './Timeline.svelte';
    import Tabs from '../widgets/Tabs.svelte';
    let idx = 0;
    let heading: string = $currentBook ? $_('book.metadata') : $_('book.open');

    let tabdef = [
        {
            name: $_('book.book'),
            content: Book,
            display: true,
        },
        { name: $_('book.chapter'), content: Chapters, display: false },
        { name: $_('book.persons'), content: Person, display: false },
        { name: $_('book.places'), content: Place, display: false },
        { name: $_('book.timeline'), content: Timeline, display: false },
    ];

    currentBook.subscribe((b) => {
        idx = 0;
        if (b == undefined) {
            tabdef.forEach((t) => {
                t.display = false;
            });
            tabdef[0].display = true;
        } else {
            tabdef.forEach((t) => {
                t.display = true;
            });
        }
        tabdef = tabdef;
    });
</script>

<div>
    <Tabs tabs={tabdef} bind:activeTab={idx} />
</div>
