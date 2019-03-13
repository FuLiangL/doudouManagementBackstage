function getTimeStamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()+1>9 ? now.getMonth()+1 : '0'+(now.getMonth()+1) 
  const date = now.getDate()>9 ? now.getDate() : '0'+now.getDate()
  const hour = now.getHours>9 ? now.getHours() : '0'+now.getHours()
  const min = now.getMinutes()>9 ? now.getMinutes() : '0'+now.getMinutes()
  const sec = now.getSeconds()>9 ? now.getSeconds() : '0'+now.getSeconds()
  return `${year}-${month}-${date} ${hour}:${min}:${sec}`
}
function getGitVersionInfo() {
  try {
    const exec = require('child_process').execSync
    const branchName = exec('git branch').toString().match(/\*\s+(.+)/)[1]
    const commitHash = exec('git log').toString().match(/^commit\s+(.+)/)[1].slice(0, 8)
    return { branchName, commitHash }
  } catch (e) {
    return { branchName: 'unknown', commitHash: 'unknown' }
  }
}
function genBuildInfo() {
  let result = ''
  const gitInfo = getGitVersionInfo()
  result = `%c 后台: ${gitInfo.branchName} -> ${gitInfo.commitHash} -> ${getTimeStamp()}`
  return result
}
module.exports = {
  NODE_ENV: '"production"',
  BUILD_INFO: JSON.stringify()
}
