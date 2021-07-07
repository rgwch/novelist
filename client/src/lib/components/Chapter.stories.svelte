import Chapter from './Chapter.svelte'

export default {
  title: "Novelist/Chapter",
  component: Chapter
}

const Template = ({...args}) => ({
  component: Chapter,
  props: args
})

export const Default = Template.bind({});
Default.args = {

}
