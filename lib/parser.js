const ts = require('typescript');
const path = require('path');
const fs = require('fs');

const types = {
  136: 'string',
  133: 'number',
  122: 'boolean'
};

function getDecorator(node, kind) {
  if (node.decorators && node.decorators.length) {
    for (const decorator of node.decorators) {
      if (decorator.expression.expression.text === kind) {
        return decorator.expression.expression.text;
      }
    }
  }
}

function getDocs(node) {
  let doc = [];
  if(node.jsDoc && node.jsDoc.length) {
    for(const d of node.jsDoc) {
      doc.push(d.comment)
    }
  }
  if(doc.length) {
    return doc.join('/n');
  } else {
    return undefined;
  }
}

function getInputType(node) {
  if(node.type) {
    let type = node.type.kind;
    if(types[node.type.kind]){
      return types[node.type.kind];
    } else {
      if (node.type.kind === ts.SyntaxKind.TypeReference) {
        return node.type.typeName.text;
      }
    }
    return type;
  }
}

function getOutputType(node) {
  if (node.type && node.type.kind === ts.SyntaxKind.TypeReference) {
    if (node.type.typeArguments && node.type.typeArguments.length) {
      for (const arg of node.type.typeArguments) {
        if(arg.typeName) {
          return arg.typeName.text;
        }
      }
    }
  }
}

function parseTypeScript(matchedFiles) {
  const metas = [];

  for (const sourcePath of matchedFiles) {
    const sourceContent = fs.readFileSync(sourcePath, 'utf-8');

    const sourceFile = ts.createSourceFile(
      sourcePath, sourceContent, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

    const visit = (node, parent) => {
      let meta;
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        meta = {
          src: sourcePath,
          component: node.name.text,
          docs: getDocs(node),
          inputs: [],
          outputs: []
        };

        if (getDecorator(node, 'Component')) {
            metas.push(meta);
        }
      } else if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
        if (getDecorator(node, 'Input')) {
          parent.inputs.push({
            name: node.name.text,
            doc: getDocs(node),
            default: node.initializer ? node.initializer.text : undefined,
            type: getInputType(node)
          });
        } else if (getDecorator(node, 'Output')) {
          parent.outputs.push({
            name: node.name.text,
            doc: getDocs(node),
            type: getOutputType(node)
          });
        }
      }

      ts.forEachChild(node, (n) => visit(n, meta));
    };

    visit(sourceFile);
  }

  return metas;
}

module.exports = parseTypeScript;
