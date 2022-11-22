const {addFavoris} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.post('/api/ajout/favoris', async function (request, response) {
    try {
      const result = await addFavoris(request.body);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}