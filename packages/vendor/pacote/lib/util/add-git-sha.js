// add a sha to a git remote url spec
const addGitSha = (spec, sha) => {
  // the sha replaces any committish or semver range, but the subdirectory
  // still selects the package within the resolved commit
  const subdir = spec.gitSubdir ? `::path:${spec.gitSubdir.slice(1)}` : ''
  if (spec.hosted) {
    const h = spec.hosted
    const opt = { noCommittish: true }
    const base = h.https && h.auth ? h.https(opt) : h.shortcut(opt)

    return `${base}#${sha}${subdir}`
  } else {
    // don't use new URL for this, because it doesn't handle scp urls
    // strip the committish with indexOf/slice to avoid a regexp redos
    const hashIndex = spec.rawSpec.indexOf('#')
    const base = hashIndex === -1 ? spec.rawSpec : spec.rawSpec.slice(0, hashIndex)
    return `${base}#${sha}${subdir}`
  }
}

module.exports = addGitSha
