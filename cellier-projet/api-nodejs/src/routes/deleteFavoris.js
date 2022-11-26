const {deleteFavoris} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.delete('/api/delete/utilisateur/:id/favoris/vin/:vin', async function (request, response) {
    try {
      var utilisateur = request.params.id
      var vin = request.params.vin
      const result = await deleteFavoris(utilisateur, vin);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}