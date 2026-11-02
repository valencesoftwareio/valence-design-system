# Contributing

Install Node 24 and pnpm 11, then run `pnpm install`. Before opening a pull
request, run `pnpm verify`.

## Visual changes

Open pull requests that intentionally change rendered output as drafts. Run
the web baseline-update workflow first, then run the native baseline-update
workflow after the web baseline commit lands. Review the generated screenshots
and commit the approved baselines before marking the pull request ready. This
keeps the required visual checks meaningful, avoids competing baseline commits,
and prevents expected failures against stale baselines.

## Package releases

The four published packages use the same version. A release updates and
publishes all four together.

The pull request title determines the release:

- `fix:` creates a patch release.
- `feat:` creates a minor release.
- `feat!:` and other titles containing `!` create a major release.
- `docs:`, `test:`, `chore:`, `build:`, and `ci:` do not create a release.

Use a clear title because it is also used in the changelog. Pull requests are
squash merged so the validated title becomes the commit on `main`.

After a releasable pull request merges, Release Please opens or updates a
release pull request containing the shared version and changelog changes.
Merging it publishes all four packages to GitHub Packages after CI passes.
