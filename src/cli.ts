#!/usr/bin/env node
import { createNiceTree } from './index.js'

const root = process.argv[2]

console.log(createNiceTree(root === undefined ? {} : { root }))
