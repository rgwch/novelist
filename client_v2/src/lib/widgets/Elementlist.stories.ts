import type { Meta, StoryObj } from '@storybook/svelte';
import '../services/i18n/i18n';
import El from './Elementlist.svelte';
const definition = {
	type: 'dings',
	newelem: 'new dings',
	promptname: 'new dings'
};
const data = {
	dings: ['one', 'two', ' more']
}

const meta = {
	title: "Widgets/Elementlist",
	component: El
} satisfies Meta<El>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: { metadata: meta, definition }
}
