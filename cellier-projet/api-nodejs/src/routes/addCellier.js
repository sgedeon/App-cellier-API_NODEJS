const {addCellier} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.post('/api/ajout/cellier', async function (request, response) {
    try {
      const result = await addCellier(request.body);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}