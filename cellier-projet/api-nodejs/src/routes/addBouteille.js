const {addBouteille, addBouteillePerso} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.post('/api/ajout/vin/cellier/:vinCellier', async function (request, response) {
    try {
      if (request.body.body.personnalise == 1) {
          const result = await addBouteillePerso(request.body);
          response.send({ success: true, result });
      } else {
          const result = await addBouteille(request.body);
          response.send({ success: true, result });
      }
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}