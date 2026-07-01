export interface NiceTreeOptions {
  root?: string
}

export function createNiceTree(options: NiceTreeOptions = {}): string {
  return options.root ?? process.cwd()
}
