const {getAllBouteilles} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/cellier/:id/vins", async function (request, response) {
    try {
      var id = request.params.id;
      const result = await getAllBouteilles(id);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}