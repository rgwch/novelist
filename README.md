![](client/public/favicon.png) 

# Novelist 

A Novel writer's toolkit. Client/Server oriented, so you could work on your next book from a PC, Laptop, Tablet or even a Smartphone. Keep Story, persons, places and timeline ready.

On the other hand: My playground for Svelte, SocketIO, TailwindCSS, Testing-Library, Storybook, Codecept. 

## Getting started

* Make sure you have NodeJS 14 or higher installed and active.
* Clone this repository, `cd` into the repository and execute `npm i`  in the server subdirectory and in the client subdirectory.
* Make any personal modifications to client/src/tailwind.css (or just keep it for now). Do *not* modify client/public/tailwind.css manually.
* In the client subdir, launch `npm run build:tailwind`. This will compile src/tailwind.css with the Tailwind utilities to public/tailwind.css.
* type `npm start` in the server directory
* type `npm run dev` in the client directory to launch the development server
* Navigate your browser to http://localhost:3000
* For production build: `build.sh` in the base directory. Target is at http://localhost:5000 then (configurable)

## Configuration

The json-files in server/config define some behaviour. See default_sample.json as an example.
````
{
    "basedir": "/base/dir/for/novels",
    "salt": "someRandomSaltString",
    "port": 2999,
    "timeout": 600,
    "encryption": true
}
}
````
* basedir: absolute path on the server where .novel files are located
* salt: an initialization value for the encryption. Each installation of Novelist should have an individual salt, but within one installation, the salt should always remain the same. Decryption of a file is only possible with the same salt as was used for encryption.
* port: the port where the server should listen. Do not change in development mode.
* timeout: If no interaction is received from a client within that time (in seconds), the current book of that client is saved and closed.
* encryption: If true, the .novel files are compressed and encrypted. If false, they're just plaintext files, consisting of stringified JSON.

You can have a 'production.json' with values to override the default values in production mode. You might want to override e.g. the port setting.

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

* Enter new keys in client/src/services/i18n/de.json
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

Novelist will always keep several copies of every book: bookname.novel_1 to bookname.novel_5 are updated with every save. And every day a new bookname_yy-mm-dd.novel is created with the current contents at the first save of that day.

## Limitations

Not multiuser capable. Only one client can work on any book at a time. It is possible, however to have several clients connected with one server, each working on their own book.

## Credits

[Svelte](https://svelte.dev)

[Tailwind CSS](https://tailwindcss.com/)

[SocketIO](https://socket.io/)

[SimpleMDE](https://simplemde.com/)





