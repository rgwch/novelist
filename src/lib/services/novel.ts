import fs from 'fs/promises';

type metadata_def = {
	title: string;
	author?: string;
	chapters: [];
	persons: [];
	places: [];
	[propName: string]: any;
};
type person_def = {
	name: string;
	nicknames?: Array<string>;
	gender?: 'm' | 'f';
	height: number;
	birthDate: Date;
	description: string;
};
type place_def = {
	name: string;
	surround?: string;
	description?: string;
};
type chapter_def = {
	title: string;
	persons?: Array<string>;
	places?: Array<string>;
	time: string;
	text: string;
};
type noveldef = {
	metadata: metadata_def;
	persons: Array<person_def>;
	places: Array<place_def>;
	time: string;
	chapters: Array<chapter_def>;
};
export class Novel {
	def: noveldef;
	constructor(private novelname: string, private password?: string) {
		fs.readFile(novelname)
			.then((def) => {
				this.def = JSON.parse(def.toString('utf-8'));
			})
			.catch((err) => {
                console.log(err)
				this.def = {
					metadata: {
						title: 'unknown',
						chapters: [],
						persons: [],
						places: []
					},
					persons: [],
					places: [],
					chapters: [],
					time: ''
				};
			});
	}

    flush():void{
        const file=JSON.stringify(this.def)
        fs.writeFile(this.novelname,file)
    }

    writePerson(name: string, pdef:person_def){
        
    }
}
