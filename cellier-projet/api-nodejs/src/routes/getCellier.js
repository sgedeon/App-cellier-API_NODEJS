const {getCellier} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/utilisateur/:id/cellier/:cellier", async function (request, response) {
    try {
      var cellier = request.params.cellier;
      const result = await getCellier(cellier);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}