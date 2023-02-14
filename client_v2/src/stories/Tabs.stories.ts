import type { Meta, StoryObj } from '@storybook/svelte';
import '../lib/services/i18n/i18n';
import Tabs from '../lib/widgets/Tabs.svelte';
import Demo1 from './Demo1.svelte';
import Demo2 from './Demo2.svelte';


const tabs=[
  {
    name: "One",
    content: Demo1,
		display: true
  },{
		name:"Two",
		content: Demo2,
		display: true
	}
]
let idx = 3
const meta = {
	title: "Widgets/Tabs",
	component: Tabs
} satisfies Meta<Tabs>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tabs
	}
}
