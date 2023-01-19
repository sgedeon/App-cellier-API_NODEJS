const axios = require('axios');
const JSDOM = require('jsdom');
const genericError = "Marche pô";

module.exports = (app) => {
  app.get("/api/get/vins/:type/saq/", async function (request, response) {
    try {
      var type = request.params.type;
      const result = await getBouteillesSAQ(type);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
          success: false,
          error: genericError,
      });
    }
  });
}

const getBouteillesSAQ = async (type) => {
    let url = "https://www.saq.com/fr/produits/vin/vin-" + type.admin + "?p=1&product_list_limit=96&product_list_order=name_asc";
    axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
    })
    .then(response => {
        const dom = new JSDOM(response.data);
        let elResults = dom.window.document.getElementById("toolbar-amount");
        let nbResults = parseInt(elResults.getElementsByTagName("span")[2].textContent);
        let response = {
            status: 200,
            body: nbResults
        }
    })
    .catch(error => {
        console.log(error);
    });
}