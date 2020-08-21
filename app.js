const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const https = require("https");

const contentService = require("./src/repository/content"); 
const reference = require("./src/models/reference"); 
const dbHandler = require("./src/repository/db-handler");
const { response } = require("express");

const app = express();
const port = 8000;

dbHandler
  .connect()
  .then((client) => {
    console.log("Connected to Database");

    // ===============================
    // Middlewares
    // ===============================
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    app.use(bodyParser.json());
    app.use("/public", express.static(path.join(__dirname, "public")));
    app.set("view engine", "ejs");

    // ===============================
    // Routes
    // ===============================

    app.get("/view/data", (req, res) => {
      contentService.getAll().then((retVal) => {
        if (retVal) {
          //console.log("All References: " + retVal);
          res.render("index", { data: retVal });
        } else {
          response.status(404).send();
        }
      });      
    });

    app.get("/api/references", (request, response) => {
      contentService.getAll().then((retVal) => {
        
        if (retVal) {
          //console.log("All References: " + retVal);
          response.json(retVal);
        } else {
          response.status(404).send();
        }
      });
    });
        
    app.post("/api/data", (req, res) => {
      let url = req.body.url;
      console.log("URL:" + req.body.url);
      let data;
      https.get(url, (httpsRes) => {
        let body = "";
        httpsRes.on("data", (chunk) => {
          body += chunk;
        });
        httpsRes.on("end", () => {
          try {
            let jsonData = JSON.parse(body);
            let parsedData = contentService.parseData(jsonData);
            console.log("Parsed Data:" + parsedData);

            for (var i = 0; i < parsedData.length; i++) {
              reference.create(parsedData[i]).then((refResponse) => {
              });
            }
            res.redirect("/view/data");
          } catch (error) {
            console.error(error.message);
          }
        });
      });
    });

    app.get("/api/data", (request, response) => {
      response.json(contentService.parseData());
    });

    app.delete("/api/data", (req, res) => {
      reference
        .remove({})
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("#Deleted Records:" + result.deletedCount);
          res.redirect("/view/data");
        })
        .catch((error) => console.error(error));
    });

    // ================================
    // Listen
    // ================================

    app.listen(port, () => {
      console.log("app started");
    });
  })
  .catch(console.error);
