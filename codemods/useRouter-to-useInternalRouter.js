import { normalize } from 'path';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const currentFilePath = file.path;
  const normalizedPath = normalize(currentFilePath);

  if (normalizedPath.match(/hooks[\\/]+useInternalRouter\.(ts|tsx)$/)) {
    return null;
  }

  const fromPath = 'next/navigation';
  const toPath = '@/hooks/useInternalRouter';
  let shouldInsertInternalImport = false;

  // 1. useRouter import 제거
  root.find(j.ImportDeclaration, { source: { value: fromPath } }).forEach(path => {
    const specifiers = path.node.specifiers;
    const hasUseRouter = specifiers.some(s => s.imported.name === 'useRouter');
    if (!hasUseRouter) {return;}

    path.node.specifiers = specifiers.filter(s => s.imported.name !== 'useRouter');
    shouldInsertInternalImport = true;
    if (path.node.specifiers.length === 0) {j(path).remove();}
  });

  // 2. useRouter() 호출명 교체
  root.find(j.CallExpression, {
    callee: { type: 'Identifier', name: 'useRouter' },
  }).forEach(path => {
    path.node.callee.name = 'useInternalRouter';
  });

  // 3. router.push/replace 템플릿 리터럴 쿼리 처리만 변환
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { name: 'router' },
      property: { name: name => ['push', 'replace'].includes(name) }
    }
  }).forEach(path => {
    const [arg] = path.node.arguments;
    if (arg?.type !== 'TemplateLiteral') {return;}

    const raw = arg.quasis.map(q => q.value.cooked).join('');
    if (!raw.includes('?')) {return;} // ❗쿼리 스트링이 없으면 변환하지 않음

    const { quasis, expressions } = arg;
    const pathExpr = expressions[0]; // ROUTES.XXX

    const queryProps = [];

    for (let i = 1; i < quasis.length; i++) {
      const cooked = quasis[i].value.cooked || '';
      const keyMatch = cooked.match(/[?&]([^=]+)=/);
      const key = keyMatch?.[1];
      const expr = expressions[i];

      if (key && expr) {
        queryProps.push(j.property('init', j.identifier(key), expr));
      }
    }

    const newArgs = [pathExpr, j.objectExpression(queryProps)];
    path.node.arguments = newArgs;
  });

  // 4. useInternalRouter import 삽입
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
}