import {Zipper} from './zipper'
import fs from 'fs'
import YAML from 'yaml'

describe("zipper",()=>{
    beforeAll(()=>{
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        fs.rm("test/sample1.zip",()=>{})
    })
    afterAll(()=>{
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        fs.rm("test.sample1.zip",()=>{})
    })
    it("opens a noveldef",()=>{
        const zipper=new Zipper("test/sample.zip")
        expect(zipper).toBeDefined
        const list=zipper.list()
        expect(list).toBeInstanceOf(Array)
    })
    it("reads files from the noveldef",()=>{
        const zipper=new Zipper("test/sample.zip")
        const brutus=zipper.getFile("persons/brutus.md")
        expect(brutus).toBeDefined
        expect(zipper.getFile("chapters/1.md")).toBeDefined
        expect(zipper.getFile("places/illyria.md")).toBeDefined
        expect(zipper.getFile("metadata.yaml")).toBeDefined
        expect(zipper.getFile("time.md")).toBeDefined
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
        zipper.writePerson("elvis",{name: "Elvis Aalborg",nicknames:["fish"]},"A Sample person")
        const meta=zipper.readMetadata()
        expect(meta).toBeDefined
        expect(meta.persons).toBeDefined
        expect(meta.persons).toBeInstanceOf(Array)
        expect(meta.persons[0]).toEqual("Elvis Aalborg")
        const elvis=zipper.readPerson("elvis")
        expect(elvis).toBeDefined
        expect(elvis.description).toBeDefined
        expect(elvis.properties).toBeDefined
        elvis.description="This is only a sample person"
        elvis.properties.nicknames=["elv","elvis","HIM"]
        zipper.writePerson("elvis",elvis.properties,elvis.description)
    })

})