---
name: create-pr
description: Prepare and create a GitHub pull request for the current repository. Use when the user asks to commit, push, open a PR, write a PR description, or share changes for team review. Inspect the actual diff, include only authorized files, run proportionate verification, push the branch, and create a clear Korean PR that an IT Meister high school student can understand. Do not merge the PR unless the user explicitly asks.
---

# PR 생성

Create a reviewable pull request from the real branch state. Explain the change in simple Korean without hiding important technical facts.

## 1. Check the working state

1. Read `AGENTS.md` and repository Git rules.
2. Inspect:
   - current branch;
   - target base branch;
   - `git status`;
   - staged and unstaged diffs;
   - recent commit style;
   - configured remote;
   - repository PR template, if present.
3. Preserve unrelated user changes.
4. If the user asks for only certain files, stage and commit only those files.
5. Never include secrets, local environment files, generated caches, or unrelated debug artifacts.

If the current branch contains unrelated work, use a separate branch or worktree instead of stashing or overwriting the user's work.

## 2. Verify before committing

Choose checks based on the change:

- documentation or skills: format, links, structure validator, and `git diff --check`;
- frontend logic: type-check, lint, relevant tests;
- routes, fonts, build configuration, or server/client boundaries: production build;
- API changes: schema/type checks and relevant service tests.

State which warnings existed before the change. Do not claim that a check passed if it was not run.

## 3. Create the commit

1. Review `git diff --cached --name-only`.
2. Confirm every staged file belongs to the requested change.
3. Use a Conventional Commit message:

```text
feat(scope): ...
fix(scope): ...
chore(scope): ...
docs(scope): ...
test(scope): ...
```

4. Commit only after the staged diff and verification are clean.

## 4. Push safely

- Push the current feature branch with upstream tracking.
- Do not force-push unless the user explicitly authorizes it.
- Do not push directly to protected branches such as `main` or `dev`.
- Confirm the remote branch after pushing.

## 5. Write an easy PR description

Use short sentences and explain unfamiliar terms once. Prefer the background and solution process over a long file-by-file change list. Help the reviewer understand why the chosen approach is reasonable.

Recommended structure:

```markdown
## 배경

어떤 불편이나 반복 문제가 있었는지 설명합니다.
지금 해결해야 하는 이유와 목표를 적습니다.

## 해결 과정

- 확인한 기존 구조와 제약
- 검토한 방법과 선택한 방법
- 그 방법을 선택한 이유
- 구현하면서 함께 막은 실수나 위험

## 결과

- 최종적으로 가능해진 일
- 핵심 변경 요약
- 팀에 미치는 영향

## 어떻게 사용하나요?

명령어나 실제 사용 예시를 적습니다.

## 확인한 내용

- [x] 실행한 검사
- [x] 테스트 또는 validator

## 리뷰할 때 봐주세요

- 팀원이 결정하거나 확인할 부분

## 아직 하지 않은 것

- 이번 PR 범위 밖의 작업이나 알려진 제한
```

Keep `결과` shorter than `배경` and `해결 과정` unless the change itself requires detailed migration instructions.

For a repository skill PR, also explain:

- what a Codex skill is;
- where the skills are stored;
- whether teammates need installation;
- explicit invocation examples using `$skill-name`;
- how to update and validate a skill;
- what behavior remains controlled by `AGENTS.md`.

## 6. Create and verify the PR

1. Use `gh pr create` with the correct base and head.
2. Avoid shell interpolation hazards when the body contains `$skill-name`; use a safely quoted temporary body file.
3. Open or inspect the created PR with `gh pr view`.
4. Return:
   - branch name;
   - commit hash and message;
   - PR title and URL;
   - verification results;
   - any follow-up decision.

Do not merge, add reviewers, labels, or assignees unless requested or required by an existing repository rule.
