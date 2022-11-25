const {getInventairesBouteille} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/utilisateur/:utilisateur/vinsInventaire/:bouteille", async function (request, response) {
    try {
      var utilisateur = request.params.utilisateur;
      var bouteille = request.params.bouteille;
      const result = await getInventairesBouteille(utilisateur, bouteille);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}