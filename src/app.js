const express = require('express');

const app = express();
const port = 7777;

app.use((req, res) => {
    res.send("Hello from server");
})

app.listen(port, () => console.log(`devTinder backend server is listeninig on ::: http://localhost:${port}`))