const DB = require("../db/db")
const db = new DB('koala');

const Mapper = require("../mapper/mapper");
const mapper = new Mapper();

const express = require("express");
const config = require("../config/config.json");





const app = express();

app.get('/', (req, res) => {
    res.send("X-Ray Tracker Mapper.");
});

app.get('/host/:hostName', async (req, res) => {
    let message = {"details":"unknown"};
    let headersSent = false;
    process.on('uncaughtException', function (err) {
        try{
            if(!headersSent){
                res.send({"UNCAUGHT_ERROR":err.toString()});
                headersSent = true;
            }
        }
        catch(err) {
            console.log(`Unable to send uncaught error message ${err}`);
        }
    });
    try{
        let mapping = await mapper.processHostCompanyRequest(req.params.hostName);

        if(!headersSent){
            if(mapping.companyID != undefined
            && mapping.companyName != undefined
            && mapping.hostID != undefined
            && mapping.hostName != undefined) {
                message = mapping;
            }
            headersSent = true;
            res.send(message);
        }
    }
    catch(err){
        console.log(`Error ${err}`);
        if(!headersSent) {
            res.send({"ERROR":err.toString()});
        }
    }
    finally {
        headersSent = false;
    }
});

app.listen(config.api.port, function() {
    console.log(`listening on port ${config.api.port}`)
});

