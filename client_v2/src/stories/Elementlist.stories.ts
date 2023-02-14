import type { Meta, StoryObj } from '@storybook/svelte';
import '../lib/services/i18n/i18n';
import El from '../lib/widgets/Elementlist.svelte';

const data = [[1, 'one'], [2, 'two'], [9, 'more']]
let idx = 3
const meta = {
	title: "Widgets/Elementlist",
	component: El
} satisfies Meta<El>

const label = (elem) => '<span style="color:red;">' + elem[0] + "</span><br /><span>" + elem[1] + "</span>"
export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		elements: data, newelem: 'new dings',
		promptname: 'dings',
		label: label,
		create: label => [idx++, label]
	}
}
