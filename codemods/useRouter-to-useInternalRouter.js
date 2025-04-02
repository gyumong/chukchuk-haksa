import { normalize } from 'path';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const currentFilePath = file.path;
  const normalizedPath = normalize(currentFilePath);

  // 1. 변환 제외: useInternalRouter.ts 본인은 스킵
  if (normalizedPath.includes('hooks/useInternalRouter.ts')) {
    return null;
  }

  const fromPath = 'next/navigation';
  const toPath = '@/hooks/useInternalRouter';

  let shouldInsertInternalImport = false;

  // 2. import { useRouter, ... } from 'next/navigation'
  root.find(j.ImportDeclaration, { source: { value: fromPath } }).forEach(path => {
    const specifiers = path.node.specifiers;

    const hasUseRouter = specifiers.some(
      s => s.type === 'ImportSpecifier' && s.imported.name === 'useRouter'
    );

    if (!hasUseRouter) {
      return;
    }

    // useRouter 제거
    path.node.specifiers = specifiers.filter(
      s => !(s.type === 'ImportSpecifier' && s.imported.name === 'useRouter')
    );

    shouldInsertInternalImport = true;

    // 빈 import면 제거
    if (path.node.specifiers.length === 0) {
      j(path).remove();
    }
  });

  // 3. useRouter() 호출 → useInternalRouter()
  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'useRouter' },
  }).forEach(path => {
    path.node.callee.name = 'useInternalRouter';
  });

  // 4. useInternalRouter import 삽입 (없을 경우만)
  const alreadyHasImport = root.find(j.ImportDeclaration, {
    source: { value: toPath },
  }).size();

  if (shouldInsertInternalImport && !alreadyHasImport) {
    const importDecl = j.importDeclaration(
      [j.importSpecifier(j.identifier('useInternalRouter'))],
      j.literal(toPath)
    );
    root.get().node.program.body.unshift(importDecl);
  }

  return root.toSource({ quote: 'single' });
};