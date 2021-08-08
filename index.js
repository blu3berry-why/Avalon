const express = require("express");

let app = express();

let server = app.listen(3000, function () {
  console.log("Listening on port : 3000");
});
