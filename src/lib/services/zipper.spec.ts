import {Zipper} from './zipper'
import fs from 'fs'
import YAML from 'yaml'

describe("zipper",()=>{
    beforeAll(()=>{
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        fs.rm("test/sample1.zip",()=>{})
    })
    it("opens a noveldef",()=>{
        const zipper=new Zipper("test/sample.zip")
        expect(zipper).toBeDefined
        const list=zipper.list()
        expect(list).toBeInstanceOf(Array)
    })
    it("reads files from the noveldef",()=>{
        const zipper=new Zipper("test/sample.zip")
        const brutus=zipper.getFile("sample/persons/Brutus.md")
        expect(brutus).toBeDefined
        expect(zipper.getFile("sample/chapters/1.md")).toBeDefined
        expect(zipper.getFile("sample/places/illyria.md")).toBeDefined
        expect(zipper.getFile("sample/metadata.yaml")).toBeDefined
        expect(zipper.getFile("sample/time.md")).toBeDefined
    })
    it("creates a new noveldef",()=>{
        const zipper=new Zipper("test/sample1.zip")
        const metadata=zipper.getFile("metadata.yaml")
        expect(metadata).toBeDefined
        const yaml=YAML.parse(metadata)
        expect(yaml).toBeDefined
        expect(yaml.title).toEqual("unknown")
    })

    it("adds and modifies a file",()=>{
        const zipper=new Zipper("test/sample1.zip")
        zipper.writePerson("Elvis",{name: "Elvis Aalborg",nicknames:["fish"]},"A Sample person")
        const meta=zipper.readMetadata()
        expect(meta).toBeDefined
        expect(meta.persons).toBeDefined
        expect(meta.persons).toBeInstanceOf(Array)
        expect(meta.persons[0]).toEqual("Elvis Aalborg")
    })

})