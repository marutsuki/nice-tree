import * as fs from "fs";
import * as path from "path";

/**
 * Represents a node in the directory tree.
 */
type TreeNode = {
  /** The name of the node. */
  name: string;
  /** The type of the node, either "file" or "directory". */
  type: "file" | "directory";
  /** The path of the node. */
  path: string;
  /** The children of the node, if it is a directory. */
  children?: TreeNode[];
};

/**
 * Recursively builds a tree structure representing the directory contents.
 *
 * @param rootPath - The path of the directory to build the tree from.
 * @returns A TreeNode representing the directory and its contents.
 */
function getDirectoryTree(rootPath: string): TreeNode {
  return getSubDirectoryTree(rootPath, rootPath);
}

function getSubDirectoryTree(dirPath: string, rootPath: string): TreeNode {
  const name = path.basename(dirPath);
  const stats = fs.statSync(dirPath);
  // We need the relative path so that the links in the generated HTML works for web servers.
  const relativePath = path.relative(rootPath, dirPath);

  if (stats.isDirectory()) {
    const node: TreeNode = { name, type: "directory", path: relativePath };
    const files = fs.readdirSync(dirPath);

    node.children = files.map((file) => {
      return getSubDirectoryTree(path.join(dirPath, file), rootPath);
    });

    return node;
  }

  return { name, type: "file", path: relativePath };
}

export type { TreeNode };
export { getDirectoryTree };
