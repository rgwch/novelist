![](static/favicon.png) 

# Novelist 

A Novel writer's toolkit with simplicity and flexibility in mind. Work on your next book from a PC, Laptop, Tablet or even a Smartphone. Keep Story, persons, places and timeline ready.

## Getting started

* Make sure you have NodeJS 14 or higher installed and active.
* make sure you have gulp.js globally installed (`npm i -g gulp-cli`)
* clone the repository, `cd` into the repository and apply `npm i` in the client subdirectory and in the server subdirectory.
* Make any personal modifications to static/css/tailwind.css (or just keep it for now)
* launch `npm run build:tailwind`
* type `npm run dev` to launch the development server
* Navigate your browser to http://localhost:3000

## Concepts

### Main Text area

The book is divided into chapters. Each chapter has a summary and a position in the time.

### Persons

Description of all important persons in the story.

### Places

Description of all important places in the story. 

### Timeline

Each chapter is linked to a certain position in time.

### Notes

Free text to collect ideas, concepts and so on.

## Output options

Novelist can export files as HTML or as ePub files. You can inspect HTML files in the Browser end export them from there to PDF. The ePub files can be displayed in a eBook viewer. 

## Privacy

Usually, you'll not want to have your book disclosed to other people, before you decide it's ready for that. That's why novelist book files are encrypted by default.


## Internationalization

* Enter new keys in src/services/i18n/de.json
* launch `npm run i18n` to apply keys to other languages
* correct the translations in en.json, fr. json and it. json

## Test

`npm test` will run the test suite.

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
    notes.md
</pre>    

## Credits

[Svelte & SvelteKit](https://kit.svelte.dev/)

[Tailwind CSS](https://tailwindcss.com/)

[SimpleMDE](https://simplemde.com/)





