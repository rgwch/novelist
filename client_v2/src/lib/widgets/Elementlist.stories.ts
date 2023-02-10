import type { Meta, StoryObj } from '@storybook/svelte';
import '../services/i18n/i18n';
import El from './Elementlist.svelte';

const data = [[1, 'one'], [2, 'two'], [9, 'more']]
let idx=3
const meta = {
	title: "Widgets/Elementlist",
	component: El
} satisfies Meta<El>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		elements: data, newelem: 'new dings',
		promptname: 'dings',
		label: elem => elem[1] as string,
		create: label => [idx++,label]
	}
}
