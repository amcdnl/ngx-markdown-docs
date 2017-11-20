const Handlebars = require('handlebars');

const template =
`
# \`{{component}}\`
Source: _{{src}}_
{{#if doc}}
Description: {{doc}}
{{/if}}

{{#if inputs}}
## Inputs
{{#each inputs}}
### \`{{name}}\`
{{#if type}}
Type: \`{{type}}\`
{{/if}}
{{#if doc}}
Description: {{doc}}
{{/if}}
{{#if default}}
Description: \`{{default}}\`
{{/if}}

{{/each}}
{{/if}}

{{#if outputs}}
## Outputs
{{#each outputs}}
### \`{{name}}\`
{{#if type}}
Type: \`{{type}}\`
{{/if}}
{{#if doc}}
Description: {{doc}}
{{/if}}

{{/each}}
{{/if}}
`;

const tocTemplate =
`
## Components
{{#each items}}
- [{{name}}]({{path}}.md)
{{/each}}
`;

function buildTemplate(meta) {
    const compiler = Handlebars.compile(template);
    return compiler(meta);
}

function buildToc(meta) {
    const compiler = Handlebars.compile(tocTemplate);
    return compiler({ items: meta });
}

module.exports = { buildTemplate, buildToc };
