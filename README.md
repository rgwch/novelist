![](client/public/favicon.png) 

# Novelist 

A Novel writer's toolkit. Client/Server oriented, so you could work on your next book from a PC, Laptop, Tablet or even a Smartphone. Keep Story, persons, places and timeline ready.

On the other hand: My playground for Svelte, SocketIO, WindiCSS, Testing-Library, Storybook, Codecept. 

## Getting started

* Make sure you have NodeJS 16 or higher installed and active.
* Clone this repository, `cd` into the repository and execute `npm i`  in the server subdirectory and in the client_v2 subdirectory.
* type `npm run dev` in the server directory
* type `npm run dev` in the client_v2 directory to launch the development server
* Navigate your browser to http://localhost:5173
* For production build: `build.sh` in the base directory. Target is at http://localhost:2999 then (configurable in config/default.json or production.json)

## Configuration

The json-files in server/config define some behaviour. See default_sample.json as an example.
````
{
    "salt": "someRandomSaltedString",
    "port": 2999,
    "timeout": 600,
    "encryption": false,
    "storage": "file",
    "file":{
        "basedir": "/home/gerry/Dokumente/novels"
    },
    "s3":{
        "endPoint": "my.s3.server.local",
        "accessKey": "someIdentification",
        "secretKey": "verySecretAuthentication",
        "useSSL": false,
        "port": 9000
    },
    "users":{
        "johndoe": "topsecret",
        "janedoe": "othersecret"
    }
}

````
* salt: an initialization value for the encryption. Each installation of Novelist should have an individual salt, but within one installation, the salt should always remain the same. Decryption of a file is only possible with the same salt as was used for encryption.
* port: the port where the server should listen. Do not change in development mode.
* timeout: If no interaction is received from a client within that time (in seconds), the current book of that client is saved and closed.
* encryption: If true, the .novel files are compressed and encrypted. If false, they're just plaintext files, consisting of stringified JSON.
* storage: Method to store novels. Currently, "file" and "s3" are supported (see below)
* users: if this key exists, login is required to access the novel files. This has no influence on the individual files being encrypted. You might want to enable this option, if your server is publicly accessible, but disable it in a LAN or VPN environment.
  

You can have a 'production.json' with values to override the default values in production mode. You might want to override e.g. the port setting.

## Storage

Novel files are stored either in the local filesystem (of the server), or in any S3-compatible database. Prominent example of S3 Storage is [Amazon's AWS](https://aws.amazon.com/s3/), but there are others. If you want to create an S3 Storage on your own system, you might give [Minio](https://min.io/) a try. This is quite easy to set up via [Docker](https://hub.docker.com/r/minio/minio) (see [docker-compose.yaml](docker-compose.yaml) for an example).

### Storage specific settings

**file:**

* "basedir": Absolute path to the directory for .novel files.

**s3:**

* "endPoint": URL of the S3 Server
* "accessKey": Access Key (created on the server management console)
* "secretKey": Matching secret key
* "useSSL": true if you connect via public internet, probably false within your own LAN or VPN
* "port": Port on the server, defaults to 80. Minio's default port is 9000


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

Novelist will always keep several copies of every book: bookname_1.novel to bookname_5.novel are updated with every save. And every day a new bookname_yy-mm-dd.novel is created with the current contents at the first save of that day.

## Limitations

Not multiuser capable. Only one client can work on any book at a time. It is possible, however to have several clients connected with one server, each working on their own book.

## Credits

[Svelte](https://svelte.dev)

[WindiCSS](https://windicss.org/)

[SocketIO](https://socket.io/)






