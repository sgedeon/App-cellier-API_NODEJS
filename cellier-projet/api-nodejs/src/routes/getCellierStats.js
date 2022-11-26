const {getCellierStats} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/cellier/:cellier/stats", async function (request, response) {
    try {
      var cellier = request.params.cellier;
      const result = await getCellierStats(cellier);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}