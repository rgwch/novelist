# Novelist

A Novel writer's toolkit with simplicity and flexibility in mind. Work on your next book from a PC, Laptop, Tablet or even a Smartphone. Keep Story, persons, places and timeline ready.

## Prerequisites

NodeJS >14
Decent browser.

## Concepts

### Main Text area

The book is divided into chapters. Each chapter is has a summary and a position in the time.

### Persons

Description of all important persons in the story. Whenever the cursor is on a person's name or one of their nicknames, the Persons window will scroll to that person

### Places

Description of all important places in the story. Whenever the cursor is on a place's name, the Places-window will scroll to that place.

### Timeline

Each chapter is linked to a certain position in time.

## Privacy

Usually, you'll not want to have your book disclosed to other peopple, before you decide that it's time for. That's why novelist book files are encrypted by default.

## Getting started

* Make sure you have NodeJS 14 or higher installed and active.
* clone the repository, `cd` into the repository and apply `npm i` there.
* Make any personal modifications to static/css/tailwind.css (or just keep it for now)
* launch `npm run build:tailwind`
* type `npm run dev` to launch the development server
* Navigate your browser to http://localhost:3000

## Internationalization

* Enter new keys in src/services/i18n/de.json
* launch `npm run i18n` to apply keys to other languages
* correct the translations in en.json, fr. json and it. json

## Technical

Text format: Markdown

.novel file layout:

<pre>
name.novel
    metadata.yaml
    chapters
        chapter1.md
        ...
    persons
        name1.md
        ,,, 
    places
        name1.md
    timeline.md    
</pre>    

## Credits
https://simplemde.com/

Bild von <a href="https://pixabay.com/de/users/openclipart-vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=156775">OpenClipart-Vectors</a> auf <a href="https://pixabay.com/de/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=156775">Pixabay</a>

Svelte & SvelteKit

TailwindCSS

