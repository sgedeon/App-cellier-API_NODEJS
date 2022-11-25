const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

app.use(express.json());

//app.use(express.static(path.join(__dirname + "/public")));

/** Configuration du cross-origin resource sharing  */
const whitelist = ["http://localhost:3000"]; 
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

/** Bouteilles */
require('./src/routes/getAllBouteilles')(app)
require('./src/routes/getBouteille')(app)
require('./src/routes/getBouteillesInventaire')(app)
require('./src/routes/addFavoris')(app)
require('./src/routes/updateBouteille')(app)
require('./src/routes/deleteBouteille')(app)

/** favoris */
require('./src/routes/deleteFavoris')(app)
require('./src/routes/getFavoris')(app)
require('./src/routes/getFavorisId')(app)

/** Celliers */
require('./src/routes/getCelliers')(app)
require('./src/routes/getCellier')(app)

/** Utilisateurs */
require('./src/routes/createUser')(app)
require('./src/routes/deleteUser')(app)
require('./src/routes/getUtilisateur')(app)
require('./src/routes/getUtilisateurs')(app)

// On gère les routes 404.
app.use(({res}) => {
  const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
	res.status(404).json({message});
});

app.listen(3001, ()=>{
  console.log(`Server is running on ${3001}`)
})
