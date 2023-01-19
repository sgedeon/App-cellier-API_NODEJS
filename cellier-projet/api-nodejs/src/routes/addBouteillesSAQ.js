const axios = require('axios');
const JSDOM = require('jsdom');
const express = require('express');

const app = express();

app.post('/api/admin/importer/saq', (req, res) => {
  const body = req.body;

  for (let i = 0; i < 1; i++) { //permit to import sequentially multiple pages
    getProduits(body.nombre, body.page + i, body.type)
      .then((data) => {
        // do something with data
      })
      .catch((err) => {
        response.status(500).send({
            success: false,
            error: genericError,
        });
      });
  }
});

function getProduits(nombre, page, type = "rouge") {
    let url = "https://www.saq.com/fr/produits/vin/vin-" + type + "?p=" + page + "&product_list_limit=" + nombre + "&product_list_order=name_asc";
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
        let elements = dom.window.document.getElementsByTagName("li");
        let i = 0;
        for (let key in elements) {
            if (elements.hasOwnProperty(key)) {
                let noeud = elements[key];
                if (noeud.getAttribute('class') && noeud.getAttribute('class').indexOf("product-item") !== -1) {
                    let info = recupereInfo(noeud);
                    let retour = ajouteProduit(info);
                    if (!retour.succes) {
                    } else {
                        i++;
                    }
                    // ajouteProduit(info)
                    // .then((data) => {
                    //     i++;
                    // })
                    // .catch((err) => {
                    //     response.status(500).send({
                    //         success: false,
                    //         error: genericError,
                    //     });
                    // });
                }
            }
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function recupereInfo(noeud) {
    let info = {};
    const imgNode = noeud.getElementsByTagName("img")[0];
    if (imgNode.getAttribute('src').indexOf("pastille") !== -1) {
        info.img = noeud.getElementsByTagName("img")[1].getAttribute('src');
    } else {
        info.img = imgNode.getAttribute('src');
    }

    const aTitre = noeud.getElementsByTagName("a")[0];
    info.url = aTitre.getAttribute('href');

    const nom = noeud.getElementsByTagName("a")[1].textContent;
    info.nom = nom.trim();

    // Type, format et pays
    const strongElements = noeud.getElementsByTagName("strong");
    for (let i = 0; i < strongElements.length; i++) {
        if (strongElements[i].getAttribute('class') === 'product product-item-identity-format') {
            info.desc = {};
            info.desc.texte = strongElements[i].textContent;
            const aDesc = info.desc.texte.split("|");
            if (aDesc.length === 3) {
                info.desc.type = aDesc[0].trim();
                info.desc.format = aDesc[1].trim();
                info.desc.pays = aDesc[2].trim();
            }
            info.desc.texte = info.desc.texte.trim();
        }
    }

    //Code SAQ
    const divElements = noeud.getElementsByTagName("div");
    for (let i = 0; i < divElements.length; i++) {
        if (divElements[i].getAttribute('class') === 'saq-code') {
            const match = divElements[i].textContent.match(/\d+/);
            if (match) {
                info.desc.code_SAQ = match[0].trim();
            }
        }
    }

    const spanElements = noeud.getElementsByTagName("span");
    for (let i = 0; i < spanElements.length; i++) {
        if (spanElements[i].getAttribute('class') === 'price') {
            let prix = spanElements[i].textContent.trim();
            prix = prix.replace(',', '.');
            prix = prix.replace('$', '');
            info.prix = prix;
        }
    }
    return info;
}
