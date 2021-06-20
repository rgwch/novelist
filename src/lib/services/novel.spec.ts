import { Novel } from './novel';

describe('Novel', () => {
	beforeAll(async () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		// await Novel.fromDirectory('test/sample');
	});
	afterAll(() => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		// fs.rm('test.sample.novel', () => {});
	});
	it('opens a noveldef', async () => {
		const novel = await Novel.open('test/sample.novel');
		expect(novel).toBeDefined;
	});
	it('reads files from the noveldef', async () => {
		const novel = await Novel.open('test/sample.novel');
		const brutus = novel.getPerson('Brutus Allerdice');
		expect(brutus).toBeDefined;
		expect(novel.readMetadata()).toBeDefined;
		expect(novel.getTime()).toBeDefined;
	});
	it('creates a new noveldef', async () => {
		const novel = await Novel.open('test/sample1.novel');
		const metadata = novel.readMetadata();
		expect(metadata).toBeDefined;
		expect(metadata.title).toEqual('unknown');
	});

	it('adds and modifies a file', async () => {
		const novel = await Novel.open('test/sample1.novel');
		novel.writePerson('elvis', {
			name: 'Elvis Aalborg',
			nicknames: ['fish'],
			description: 'A Sample person'
		});
		const meta = novel.readMetadata();
		expect(meta).toBeDefined;
		expect(meta.persons).toBeDefined;
		expect(meta.persons).toBeInstanceOf(Array);
		expect(meta.persons[0]).toEqual('Elvis Aalborg');
		const elvis = novel.getPerson('elvis');
		expect(elvis).toBeDefined;
		expect(elvis.description).toBeDefined;
		elvis.description = 'This is only a sample person';
		elvis.nicknames = ['elv', 'elvis', 'HIM'];
		novel.writePerson('elvis', elvis);
	});
});
