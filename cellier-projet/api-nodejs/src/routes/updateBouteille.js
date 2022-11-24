const {updateBouteille} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.patch("/api/update/cellier/:cellier/bouteille/:bouteille", async function (request, response) {
    try {
      var cellier = request.params.cellier
      var bouteille = request.params.bouteille
      const result = await updateBouteille(request.body, cellier, bouteille);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}