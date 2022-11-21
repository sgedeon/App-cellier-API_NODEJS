const {deleteUser} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.delete('/api/delete/utilisateur', async function (request, response) {
    try {
      const result = await deleteUser(request.body);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}