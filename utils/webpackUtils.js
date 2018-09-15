const childProcess = require('child_process')

module.exports = {
    getLatestGitCommitHash: () => {
        return childProcess
            .execSync('git rev-parse HEAD')
            .toString().trim().slice(0, 7)
    },
}
