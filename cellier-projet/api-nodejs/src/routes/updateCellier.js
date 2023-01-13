const {updateCellier} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.patch("/api/update/cellier/:cellier/", async function (request, response) {
    try {
      var cellier = request.params.cellier
      console.log(request.body.nom);
      const result = await updateCellier(request.body, cellier);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}