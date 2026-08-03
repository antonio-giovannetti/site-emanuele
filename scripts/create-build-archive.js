const fs = require('node:fs/promises');
const path = require('node:path');
const tar = require('tar');

async function createArchive() {
  const projectName = 'psicoterapeuta-studio';
  const distRoot = path.resolve(__dirname, '..', 'dist');
  const buildDir = path.join(distRoot, projectName);
  const archiveFile = path.join(distRoot, `${projectName}.tar.gz`);

  await fs.access(buildDir);
  await fs.rm(archiveFile, { force: true });
  const entries = await fs.readdir(buildDir);
  const excludedDirs = ['assets', 'src/assets'];

  await tar.c(
    {
      gzip: true,
      file: archiveFile,
      cwd: buildDir,
      filter: (entryPath) => {
        const normalizedPath = entryPath
          .replace(/\\/g, '/')
          .replace(/^\.\/+/, '')
          .replace(/\/+$/, '');
        return excludedDirs.every(
          (excludedDir) =>
            normalizedPath !== excludedDir &&
            !normalizedPath.startsWith(`${excludedDir}/`)
        );
      }
    },
    entries
  );
}

createArchive().catch((error) => {
  console.error('Failed to create build archive:', error);
  process.exit(1);
});
