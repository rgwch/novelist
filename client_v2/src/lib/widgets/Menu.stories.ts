import type { Meta, StoryObj } from '@storybook/svelte';
import Menu  from './Menu.svelte'
import type { MenuDef } from './Popup.svelte';

const meta = {
    title: "Widgets/Menu",
    component: Menu
} satisfies Meta<Menu>

const menu1: Array<MenuDef>=[
    {
        name: "Submenu1-1",
        label: "1-1"
    },{
        name: "Submenu1-2",
        label: "1-2"
    }
]
const menu2: Array<MenuDef>=[
    {
        name: "Submenu2-1",
        label: "2-1"
    },{
        name: "Submenu2-2",
        label: "2-2"
    }
]
const def: Array<MenuDef> = [
    { name: menu1, label: "eins" },
    { name: menu2, label: "zwei" },
];
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: {
        menudef: def
    }
}
