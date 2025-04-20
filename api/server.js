// server.js

const app = require('./app'); // 引入你刚才的 app.js
const port = 5000;

app.listen(port, '127.0.0.1', () => {
  console.log(`✅ Server running at http://127.0.0.1:${port}`);
});
