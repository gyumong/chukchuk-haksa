module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const targetImportSource = 'next/navigation';
  const replacementImportSource = '@/hooks/useInternalRouter';

  // 1. import { useRouter } from 'next/navigation' → useInternalRouter
  root
    .find(j.ImportDeclaration, {
      source: { value: targetImportSource },
    })
    .forEach(path => {
      path.node.source.value = replacementImportSource;

      path.node.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'useRouter') {
          specifier.imported.name = 'useInternalRouter';
          specifier.local.name = 'useInternalRouter';
        }
      });
    });

  // 2. 모든 useRouter() → useInternalRouter()
  root
    .find(j.CallExpression, {
      callee: { type: 'Identifier', name: 'useRouter' },
    })
    .forEach(path => {
      path.node.callee.name = 'useInternalRouter';
    });

  return root.toSource({ quote: 'single' });
};
