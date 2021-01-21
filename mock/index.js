var express = require("express");
var app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.listen(8081, () => {
 console.log("Server running on port 8081");
});

require('./api/cliente')(app);
require('./api/conto')(app);
require('./api/pagamento')(app);

app.get("/", (req, res, next) => {
  res.json('Server mock in funzione',)
});
