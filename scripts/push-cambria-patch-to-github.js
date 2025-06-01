#!/usr/bin/env node

/**
 * Script to push Cambria patch to GitHub fork
 */

const { execSync } = require('child_process');
const path = require('path');

// Path to the cambria-project
const cambriaPath = '/Users/darrenzal/cambria-project';

// Function to execute commands and log output
function runCommand(command, cwd = cambriaPath) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { cwd, encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Pushing Cambria patch to GitHub fork...');

  // Check if there are any changes
  const status = runCommand('git status --porcelain');
  
  if (!status.trim()) {
    console.log('No changes to commit.');
    return;
  }

  // Create a new branch for the patch
  const branchName = `fix/array-handling-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
  runCommand(`git checkout -b ${branchName}`);

  // Add the changes
  runCommand('git add src/json-schema.ts');

  // Commit the changes
  runCommand('git commit -m "Fix: Add null check and error handling to updateSchema function"');

  // Push to GitHub
  console.log(`\nTo push the changes to your GitHub fork, run the following command in the cambria-project directory:`);
  console.log(`\ncd ${cambriaPath} && git push origin ${branchName}\n`);
  
  console.log('After pushing, you can create a pull request on GitHub to merge your changes into the main repository.');
}

// Run the main function
main().catch(console.error);
