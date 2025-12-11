import { execSync } from 'child_process';

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run prisma generate:', error);
  process.exit(1);
}
