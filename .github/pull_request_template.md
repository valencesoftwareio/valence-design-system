## Summary

<!-- What changed, and why is this the smallest appropriate solution? -->

## Change type

- [ ] Component or behavior
- [ ] Design tokens or theming
- [ ] Shared contract or public API
- [ ] Accessibility
- [ ] Documentation or Storybook
- [ ] Build, tooling, CI, or release

## Platform impact

<!-- Describe intentional differences. Do not claim parity when behavior differs. -->

- [ ] React implementation updated
- [ ] React Native implementation updated
- [ ] Shared `@valencesoftwareio/types` contract remains accurate
- [ ] Matching stories and tests are updated
- [ ] Platform-specific behavior is documented
- [ ] Not applicable — no component or public-contract impact

## Accessibility and interaction

- [ ] Keyboard and focus behavior reviewed on web
- [ ] Screen-reader semantics reviewed on web and native
- [ ] Disabled, loading, error, and reduced-motion states reviewed where relevant
- [ ] Touch targets and gesture behavior reviewed on native
- [ ] Not applicable — no user-facing behavior

## Visual and theme review

<!-- Add screenshots or recordings for visible changes. Include both platforms when applicable. -->

- [ ] Light and dark modes reviewed
- [ ] Every affected theme preset reviewed
- [ ] Contrast and component boundaries remain accessible
- [ ] Web and native visuals match as closely as their platforms allow
- [ ] Not applicable — no visual changes

## Validation performed

<!-- List any focused commands or manual device/browser checks beyond the standard gate. -->

- [ ] `pnpm verify`
- [ ] Formatting matches `pnpm format:check`
- [ ] Relevant Storybook stories exercised
- [ ] Android emulator/device exercised when native behavior changed
- [ ] iOS exercised when available, or the unverified scope is stated below

## Release impact

<!-- Use fix, feat, or ! only for changes consumers receive in the published packages. Use ci, chore, docs, or test for internal-only changes. -->

- [ ] The PR title reflects the intended release impact
- [ ] Internal tooling, CI, tests, stories, and documentation are not presented as package features or fixes
- [ ] Public API or migration notes are documented when required

## Risks and follow-up

<!-- Call out known limitations, deferred work, or areas reviewers should examine closely. -->

- [ ] No secrets, credentials, generated build output, or unrelated changes are included
