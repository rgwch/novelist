/**
 * Create a Svelte-Component, a story and a unit test for a new Component
 */
const path = require('path')
const fs = require('fs')
const name = process.argv[2]
templates(name)

function templates(name) {
  const component_file = path.resolve(__dirname, "../src/lib/components/" + name + ".svelte")
  create(component_file, "component", name)
  const story_name = path.resolve(__dirname, "../src/lib/components/" + name + ".stories.svelte")
  create(story_name, "stories", name)
  const test_name = path.resolve(__dirname, "../src/lib/components/" + name.toLowerCase() + ".spec.ts")
  create(test_name, "unittest", name)
}

function create(file, template, name) {
  console.log("creating " + file)
  const tmp = fs.readFileSync(".config/" + template + ".template").toString("utf-8")
  const proc = tmp.replace(/{{name}}/gm, name)
  fs.writeFileSync(file, proc)
}
