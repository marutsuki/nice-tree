import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";

import { getDirectoryTree } from "./tree.ts";

const tempDirectories: string[] = [];

function createTempDirectory(): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "nice-tree-"));
  tempDirectories.push(directory);
  return directory;
}

function cleanupTempDirectories(): void {
  while (tempDirectories.length > 0) {
    const directory = tempDirectories.pop();

    if (directory) {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
}

function normalizeTree(
  node: ReturnType<typeof getDirectoryTree>,
): ReturnType<typeof getDirectoryTree> {
  if (node.type === "file") {
    return { name: node.name, type: node.type };
  }

  return {
    name: node.name,
    type: node.type,
    children: (node.children ?? [])
      .map((child) => normalizeTree(child))
      .sort((left, right) => left.name.localeCompare(right.name)),
  };
}

afterEach(() => {
  cleanupTempDirectories();
});

test("returns a file node for a single file path", () => {
  const filePath = path.join(createTempDirectory(), "README.md");
  fs.writeFileSync(filePath, "# Hello");

  const tree = getDirectoryTree(filePath);

  assert.deepStrictEqual(tree, { name: "README.md", type: "file" });
});

test("returns an empty directory node when the directory has no children", () => {
  const directory = createTempDirectory();

  const tree = getDirectoryTree(directory);

  assert.deepStrictEqual(tree, {
    name: path.basename(directory),
    type: "directory",
    children: [],
  });
});

test("builds a nested tree with files and directories", () => {
  const root = createTempDirectory();
  const srcDirectory = path.join(root, "src");
  const docsDirectory = path.join(root, "docs");
  const utilsDirectory = path.join(srcDirectory, "utils");

  fs.mkdirSync(utilsDirectory, { recursive: true });
  fs.mkdirSync(docsDirectory, { recursive: true });
  fs.writeFileSync(path.join(root, "package.json"), "{}\n");
  fs.writeFileSync(path.join(srcDirectory, "index.ts"), "export {};\n");
  fs.writeFileSync(
    path.join(utilsDirectory, "helper.ts"),
    "export const helper = true;\n",
  );
  fs.writeFileSync(path.join(docsDirectory, "guide.md"), "# Guide\n");

  const tree = getDirectoryTree(root);

  assert.deepStrictEqual(normalizeTree(tree), {
    name: path.basename(root),
    type: "directory",
    children: [
      {
        name: "docs",
        type: "directory",
        children: [{ name: "guide.md", type: "file" }],
      },
      { name: "package.json", type: "file" },
      {
        name: "src",
        type: "directory",
        children: [
          { name: "index.ts", type: "file" },
          {
            name: "utils",
            type: "directory",
            children: [{ name: "helper.ts", type: "file" }],
          },
        ],
      },
    ],
  });
});

test("includes empty directories as children with an empty children array", () => {
  const root = createTempDirectory();
  const emptyDirectory = path.join(root, "empty");
  fs.mkdirSync(emptyDirectory);

  const tree = getDirectoryTree(root);

  assert.deepStrictEqual(normalizeTree(tree), {
    name: path.basename(root),
    type: "directory",
    children: [{ name: "empty", type: "directory", children: [] }],
  });
});

test("throws when the provided path does not exist", () => {
  const missingPath = path.join(createTempDirectory(), "missing", "file.txt");

  assert.throws(() => getDirectoryTree(missingPath), /ENOENT/);
});
