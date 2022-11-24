const {getFavorisId} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/utilisateur/:utilisateur/favoris", async function (request, response) {
    try {
      var id = request.params.utilisateur;
      const result = await getFavorisId(id);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}