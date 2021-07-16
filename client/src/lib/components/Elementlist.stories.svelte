<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	// import '../../../public/tailwind.css';
	import '../services/i18n/i18n';
	import El from './Elementlist.svelte';
	const definition = {
		type: 'dings',
		newelem: 'new dings',
		promptname: 'new dings'
	};
	const meta = {
		dings: ['one', 'two', ' more']
	};
</script>

<Meta title="Elementlist" component={El} />

<Template let:args>
	<El {...args} />
</Template>

<Story name="Default" args={{ metadata: meta, definition }} />
