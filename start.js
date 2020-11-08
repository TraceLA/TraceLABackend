const port = 5000;
const app = require('./server.js')

app.listen(port, () => {
    console.log(`TraceLA listening at http://localhost:${port}`);
  });