const {deleteBouteille} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.delete('/api/delete/vin/:vin/cellier/:cellier', async function (request, response) {
    try {
      var cellier = request.params.cellier
      var vin = request.params.vin
      const result = await deleteBouteille(vin, cellier);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}