const {getBouteille} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/cellier/:cellier/bouteille/:bouteille", async function (request, response) {
    try {
      var cellier = request.params.cellier;
      var bouteille = request.params.bouteille;
      const result = await getBouteille(cellier, bouteille);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}