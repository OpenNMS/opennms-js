module.exports = {
    extends: ['@commitlint/config-conventional'],
    ignores: [(message) => /^Bumps \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
    rules: {
        // Subjects here start with a JIRA key (e.g. "NMS-20266 update ..."), which
        // config-conventional reads as upper-case/start-case.
        'subject-case': [0],
    },
};
