const {findUtilisateur} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/utilisateur/:emailUtilisateur/", async function (request, response) {
    try {
      var emailUtilisateur = request.params.emailUtilisateur;
      const result = await findUtilisateur(emailUtilisateur);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}