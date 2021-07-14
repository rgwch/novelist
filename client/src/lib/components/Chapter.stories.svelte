<script lang="ts">
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import '../services/i18n/i18n';
	import Chapter from './Chapter.svelte';
</script>

<Meta title="Chapter" component={Chapter} />

<Template let:args>
	<Chapter {...args} />
</Template>

<Story name="Primary" args={{ meta: {} }} />
