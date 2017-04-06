/**
 * Uploader.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      required: true
    },
    approved: {
      type: 'boolean',
      defaultsTo: false
    },
    memory: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    homedir: {
      type: 'string',
    },
    biosversion: {
      type: 'string',
    },
    diskenum: {
      type: 'string',
    },
    biosvendor: {
      type: 'string',
    },
    systemmanufacturer: {
      type: 'string',
    }
  },
  autoPK: false

};

