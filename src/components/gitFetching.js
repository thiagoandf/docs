const BRANCH = 'master';

export const getFileStructure = () => {
  const baseUrl =
    'https://api.github.com/repos/qi-tech/api-documentation/git/trees/';
  return new Promise((resolve, reject) => {
    const treeUrl = `${baseUrl}${BRANCH}?recursive=1&client_id=bbc9f73a6c354ba2271d&client_secret=aeddb1c5e6088af99880fc62aa5defbeafa15869`;
    fetch(treeUrl)
      .then(r => r.json())
      .then(trees => {
        resolve(trees.tree);
      })
      .catch(e => reject(e));
  });
};

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
      const c = child;
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
