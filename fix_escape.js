const fs = require('fs');

const files = [
  'app/register/dashboard/RiderList.tsx',
  'app/register/rider/edit/[id]/page.tsx',
  'app/register/rider/new/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
