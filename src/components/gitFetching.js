const BRANCH = 'master';

/**
 * Fetches the file structure from Github
 * @returns {Promise<unknown>}
 */
export const getFileStructure = () => {
  const baseUrl =
    'https://api.github.com/repos/qi-tech/api-documentation/git/trees/';
  return new Promise((resolve, reject) => {
    const treeUrl = `${baseUrl}${BRANCH}?recursive=1`;
    fetch(treeUrl)
      .then(r => r.json())
      .then(trees => {
        resolve(trees.tree);
      })
      .catch(e => reject(e));
  });
};

/**
 * Get the Markdown of the file from Github
 * @param path
 * @returns {Promise<unknown>}
 */
export const getFile = path =>
  new Promise((resolve, reject) => {
    if (!path) {
      reject()
      return;
    }
    const baseUrl = `https://raw.githubusercontent.com/qi-tech/api-documentation/${BRANCH}/${encodeURIComponent(
      path,
    )}`;
    fetch(baseUrl)
      .then(r => r.text())
      .then(r => resolve(r))
      .catch(r => reject(r));
  });

/**
 * Sorts the file structure
 * @param structure
 * @returns {{}}
 */
export const organizeFilesStructure = structure => {
  const fileStructure = {};
  structure.forEach(node => {
    if (node.type === 'tree' && !node.path.includes('/')) {
      fileStructure[node.path] = node;
      fileStructure[node.path].type = 'title';
      fileStructure[node.path].children = organizeChildren(
        structure.filter(
          n => n.path.includes(node.path) && n.path.includes('/'),
        ),
      );
    }
  });
  return fileStructure;
};

const organizeChildren = (parent, depth = 2) => {
  const children = [];
  parent.forEach(child => {
    if (child.type === 'blob' && depth === child.path.split('/').length)
      children.push(child);
    else if (child.type === 'tree') {
      const c = { ...child };
      c.children = organizeChildren(
        parent.filter(
          n =>
            n.path.includes(child.path) &&
            n.path.split('/').length > child.path.split('/').length,
        ),
        child.path.split('/').length + 1,
      );
      children.push(c);
    }
  });
  return children;
};
