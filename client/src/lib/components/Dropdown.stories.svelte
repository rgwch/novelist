<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import '../services/i18n/i18n';
	import Dropdown from './Dropdown.svelte';
	const definition = {
		type: 'dings',
		newelem: 'new dings',
		promptname: 'new dings'
	};
	const meta = {
		dings: ['one', 'two', ' more']
	};
</script>

<Meta title="Dropdown" component={Dropdown} />

<Template let:args>
	<Dropdown {...args} />
</Template>

<Story name="Default" args={{ metadata: meta, definition }} />
