"use strict";
const fs = require('fs');
const https = require('https');

const referenceModel = require('../models/reference');

function parseData(data) {
    
    console.log('parseData entry:(data received)'+data);
    let referencesData = Object.values(data?.content?.references);
    let retVal = new Array();
    console.log(referencesData);
    if(referencesData){
        for (const index in referencesData){
            let element = referencesData[index];
            let reference = {
                articleId: element.id,
                title: element.headline?.default,
                free: (element.accessType == 'premium') ? false : true,
                authors: element.authors.map(a=>{return a.name;}),
                data: {
                    liveData: element.date?.live,
                    dateUpdated: element.date?.updated
                },
                originalSource: element.rightsMetadata?.originatedSource,
                section: element.target?.sections[0],
                inDt: (element.target?.domains?.includes('dailytelegraph.com.au')) ? true : false 
            };
            retVal.push(reference);
        };
    }
    
    return retVal;
};

function fetchDataJson(url){
    console.log('fetchDataJson entry:(URL):'+url);
    https.get(url,(res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
          console.log('event emitter: https data');
        });
        res.on('end', () => {
          try{
            console.log('event emitter: https end');
            let json = JSON.parse(body);
            console.log('Returned Json:'+json);            
            return json;
          }
          catch(error) {
            console.error(error.message);
          }
        })
      });
}

/**
 * Retrieves all Reference
*/
async function getAll() {
    const references = await referenceModel.find();
    //console.log('getAll: ' + references);
    return references;
    
};


module.exports = {
    parseData,
    fetchDataJson,
    getAll
}