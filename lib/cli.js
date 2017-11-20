const program = require('commander');
const parseTypeScript = require('./parser');
const glob = require('glob');
const { buildTemplate, buildToc } = require('./template');
const path = require('path');
const fs = require('fs');
const decamelize = require('decamelize');

program
    .command('build [components]')
    .action((pattern, options) => {
        console.log('🚀  Building...');

        const compPath = pattern || './src/**/*.ts';
        const files = glob.sync(compPath);
        const metas = parseTypeScript(files);

        for (const meta of metas) {
            const folder = path.dirname(meta.src);
            const template = buildTemplate(meta);
            const filename = `${folder}/${decamelize(meta.component, '-')}.md`;
            fs.writeFileSync(filename, template);
            console.log(`✨  Created ${filename}`);
        }

        const roots = {};
        for (const meta of metas) {
            const folder = path.dirname(meta.src);
            if (!roots[folder]) {
                roots[folder] = [];
            }

            roots[folder].push({
                name: meta.component,
                path: decamelize(meta.component, '-')
            });
        }

        for (const r in roots) {
            const rpath = path.resolve(`${r}/README.md`);
            if (fs.existsSync(rpath)) {
                let readme = fs.readFileSync(rpath, 'utf-8');
                const template = buildToc(roots[r]);
                if (readme.indexOf('<!-- toc -->') > -1) {
                    readme = readme.replace('<!-- toc -->', template);
                    fs.writeFileSync(rpath, readme, 'utf-8');
                    console.log(`✨  Updating TOC ${r}`);
                }
            }
        }
    });

program.parse(process.argv);
