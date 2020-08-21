/**
 * for reference in content.references{
 * articleId: reference.id,
 * title: reference.headline.default,
 * free: (reference.accessType == 'premium')? false : true,
 * authors: reference.authors,
 * data: {
 * liveData: reference.date.live,
 * dateUpdated: reference.date.updated
 * },
 * originalSource = reference.rightsMetadata.originatedSource,
 * section: reference.target.sections[0],
 * inDt: (reference.target.domain.contains('dailytelegraph.com.au'))? true : false
 * }
 * articleId = id (e.g. references.___________.id )
 * title = headline.default
 * free = false where accessType == premium.
 * authors = authors.name/s
 * data containing liveData = date.live and dateUpdated = date.updated
 * originalSource = rightsMetadata.originatedSource.
 * section = the first section in sections array.
 * inDt = true if "dailytelegraph.com.au" in the domains array.
 **/

"use strict";

const mongoose = require("mongoose");

/*
    Reference model schema.
*/

const referenceSchema = new mongoose.Schema({
  articleId: { type: String, required: true },
  title: { type: String, required: true },
  free: { type: Boolean, required: true },
  authors: [{ type: String }],
  data: {
    liveData: { type: Date },
    dataUpdated: { type: Date },
  },
  originalSource: { type: String },
  section: {
    id: { type: String },
    path: { type: String },
    slug: { type: String },
    link: { 
        self: {type: String}
     },
  },
  inDt: { type: Boolean, required: true },
});


module.exports = mongoose.model("reference", referenceSchema);
