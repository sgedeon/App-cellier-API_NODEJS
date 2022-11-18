const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(express.json());

//app.use(express.static(path.join(__dirname + "/public")));

/** Configuration du cross-origin resource sharing  */
const whitelist = ["http://localhost:3000"]; //Change to the port in which react app is running
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

/** Points d'entrée de l'API */
require('./src/routes/findAllBouteilles')(app)
require('./src/routes/createUser')(app)

require('./src/routes/findUtilisateur')(app)
require('./src/routes/findUtilisateurs')(app)

app.listen(3001, ()=>{
  console.log(`Server is running on ${3001}`)
})
