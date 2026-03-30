/* eslint-env node */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const workerHandlerPath = path.resolve(
  './node_modules/ember-cli-test-loader/node_modules/workerpool/lib/WorkerHandler.js'
);

if (!fs.existsSync(workerHandlerPath)) {
  console.log('workerpool patch skipped: nested WorkerHandler.js not found.');
  process.exit(0);
}

const before = '    me.requestQueue.forEach(me.worker.send.bind(me.worker));';
const after = '    me.requestQueue.forEach(function(request) { me.worker.send(request); });';

const content = fs.readFileSync(workerHandlerPath, 'utf8');

if (content.includes(after)) {
  console.log('workerpool patch already applied.');
  process.exit(0);
}

if (!content.includes(before)) {
  console.error('workerpool patch failed: expected source line was not found.');
  process.exit(1);
}

fs.writeFileSync(workerHandlerPath, content.replace(before, after));
console.log('Applied Node 18 workerpool compatibility patch.');
