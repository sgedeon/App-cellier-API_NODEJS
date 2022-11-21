const {getAllCelliers} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/utilisateur/:id/celliers", async function (request, response) {
    try {
      var id = request.params.id;
      const result = await getAllCelliers(id);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}