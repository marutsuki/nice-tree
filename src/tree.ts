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
  /** The children of the node, if it is a directory. */
  children?: TreeNode[];
};

/**
 * Recursively builds a tree structure representing the directory contents.
 *
 * @param dirPath - The path of the directory to build the tree from.
 * @returns A TreeNode representing the directory and its contents.
 */
function getDirectoryTree(dirPath: string): TreeNode {
  const name = path.basename(dirPath);
  const stats = fs.statSync(dirPath);

  if (stats.isDirectory()) {
    const node: TreeNode = { name, type: "directory" };
    const files = fs.readdirSync(dirPath);

    node.children = files.map((file) => {
      return getDirectoryTree(path.join(dirPath, file));
    });

    return node;
  }

  return { name, type: "file" };
}

export type { TreeNode };
export { getDirectoryTree };
