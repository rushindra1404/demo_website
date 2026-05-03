const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let lines = content.split('\n');
// We want to delete lines 593 to 699 inclusive.
// Array is 0-indexed, so line 593 is index 592.
// The number of lines to remove is 699 - 593 + 1 = 107.
lines.splice(592, 107);
fs.writeFileSync('index.html', lines.join('\n'));
console.log('Removed Doctors section');
