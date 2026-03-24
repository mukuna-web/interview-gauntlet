const { execSync } = require('child_process');
const port = process.env.PORT || 4201;
execSync(`npx next dev -p ${port}`, { stdio: 'inherit', cwd: '/Users/mukundagarwal/interview-gauntlet' });
