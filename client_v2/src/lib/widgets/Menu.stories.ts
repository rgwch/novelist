import type { Meta, StoryObj } from '@storybook/svelte';
import Menu, { type MenuDef } from './Menu.svelte'

const meta = {
    title: "Widgets/Menu",
    component: Menu
} satisfies Meta<Menu>

const def: Array<MenuDef> = [
    { name: "first", label: "eins" },
    { name: "second", label: "zwei" },
];
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        menudef: def
    }
}
