const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = 'wallywood';

console.log(`🚀 Starter opsætning af ${projectName}...`);

// 1. Opret projektmappe
if (!fs.existsSync(projectName)) {
    fs.mkdirSync(projectName);
}
process.chdir(projectName);

// 2. Initialiser npm
execSync('npm init -y', { stdio: 'inherit' });

// 3. Installer afhængigheder
console.log('📦 Installerer pakker...');
execSync('npm install express dotenv prisma @prisma/client', { stdio: 'inherit' });
execSync('npm install -D typescript ts-node @types/node @types/express nodemon', { stdio: 'inherit' });

// 4. Initialiser TypeScript og Prisma
execSync('npx tsc --init', { stdio: 'inherit' });
execSync('npx prisma init', { stdio: 'inherit' });

// 5. Opret mappestruktur (MVC)
const dirs = ['src', 'src/controllers', 'src/routes', 'src/models', 'src/middleware', 'data'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// 6. Opret basis index.ts
const indexContent = `import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Wallywood API kører!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server kører på port ' + PORT));
`;

fs.writeFileSync('src/index.ts', indexContent);

console.log('✅ Projektet er klar! Åbn mappen i VS Code.');
console.log('Husk at rette din DB_URL i .env filen og opsæt dine modeller i schema.prisma');