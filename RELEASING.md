# Releasing a new OpenNMS.js version

1. check out `develop`:
   `git checkout develop && git pull`
2. set the version in `package.json` and `package-lock.json`
3. compare to the last version to determine non-dependabot changes:
   `git log --no-merges --perl-regexp --author='^((?!dependabot).*)$' v2.5.7..HEAD`
4. update `README.md` with the high-level changelog
5. commit and push the changes: `git commit -a -m 'OpenNMS.js vX.X.X' && git push`
6. wait for CircleCI to merge the changes and generate artifacts in `main`:
   https://app.circleci.com/pipelines/github/OpenNMS/opennms-js
7. check out `main`:
   `git checkout main && git pull`
8. `npm login` as `opennms-admin` (or another account authorized to publish)
9. `npm publish`
10. tag and push the version: `git tag -u opennms@opennms.org -s vX.X.X && git push origin vX.X.X`
11. check out `develop`:
    `git checkout develop`
12. set the version to the next `X.X.Y-SNAPSHOT` version
13. commit and push the update:
    `git commit -a -m 'build: X.X.X -> X.X.Y-SNAPSHOT' && git push`
