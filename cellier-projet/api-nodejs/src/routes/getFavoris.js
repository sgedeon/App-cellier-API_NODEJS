const {getFavoris} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/favoris/utilisateur/:utilisateur", async function (request, response) {
    try {
      var utilisateur = request.params.utilisateur;
      console.log(utilisateur);
      const result = await getFavoris(utilisateur);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}