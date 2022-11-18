const {getUtilisateur} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/utilisateur/:emailUtilisateur/", async function (request, response) {
    try {
      var id = request.params.emailUtilisateur;
      const result = await getUtilisateur(emailUtilisateur);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}