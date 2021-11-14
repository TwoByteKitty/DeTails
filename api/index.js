const app = require('./src/server.js');

const PORT = process.env.PORT || 3001;

//-- Main --------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}...`);
  });