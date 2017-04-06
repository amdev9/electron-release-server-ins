/**
 * UploaderController
 *
 * @description :: Server-side logic for managing uploaders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var Promise = require('bluebird');
const crypto = require('crypto');
// server part

function sha1(toHashString) {
  shasum = crypto.createHash('sha1');
  shasum.update(toHashString);
  return shasum.digest('hex');
}

function aes192Decipher(encrypted, secret) {
  const decipher = crypto.createDecipher('aes192', secret);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function sha256(serialKey, secret) {
  const hash = crypto.createHmac('sha256', secret)
                     .update(serialKey)
                     .digest('hex');
  return hash;
}

module.exports = {
  // POLICIES -> anybody
  // + curl -H "Content-Type: application/json" -X POST -d '{"hex": "test4", "approved": "true"}' http://localhost:5014/api/uploader/
	create: function (req, res) {
    var token = req.body.token;
    if (!token) return res.badRequest("No token specified."); 
    Uploader.findOne(token, function (err, found) {
      if(err) { console.log(err);}
      var message = req.body.message;
      var secret192 = 'a password';
      if (!found) {
        console.log("not found"); 
        var params = aes192Decipher(message, secret192).split("|");
        if ( sha1(params.slice(0,5).join("|")) == token) {
          var paramsObj = {
            id: token,
            memory: params[0],
            username: params[1],
            homedir: params[2],
            biosversion: params[3],
            diskenum: params[4],
            biosvendor: params[5],
            systemmanufacturer: params[6],
            approved: false
          };
          Uploader.create(paramsObj, function(err, created) {
            if (err) {
              console.log(err);
              return res.badRequest(err); 
            }
            if (created) {
              console.log(created);
              res.send({"status": "ok", "message": "waiting_for_approval" });
            }
          });
        }
      } else {
        if (found.approved) {
          var params = aes192Decipher(message, secret192).split("|");
          var secret256 = 'abcdefg';
          var hashMessage = sha256(params.join("|"), secret256);
          res.send({"status": "ok", "message": hashMessage});
        } else {
          res.send({"status": "ok", "message": "waiting_for_approval"});
        }
      }
    });
  },

  // POLICIES -> admin auth token
  // + curl -X GET http://localhost:5014/api/uploader/
  index: function (req, res) {
    Uploader.find(function(err, all){
      if (err) return res.badRequest(err);
      res.json(all);
    });
  },
  
  // POLICIES -> admin auth token
  // + curl -X GET http://localhost:5014/api/uploader/:hex
  show: function (req,res) {
    var hex = req.allParams().hex;
    if (!hex) return res.badRequest("No id specified."); 
    Uploader.findOne(hex, function (err, found) {
      if(err) return res.badRequest(err);
      res.json(found);
    });
  },

  // POLICIES -> admin auth token
  // + curl -X DELETE http://localhost:5014/api/uploader/:hex
  destroy: function (req, res) {
    var pk = actionUtil.requirePk(req);
    var query = Uploader.findOne(pk);
    // query.populate('uploader'); //
    query.exec(function foundRecord(err, record) {
      if (err) return res.serverError(err);
      if (!record) return res.notFound(
        'No record found with the specified `hex`.'
      );
      // Remove from db
      return Promise.join(
        Uploader.destroy(pk),
        function() {})
      .then(function success() {
        if (sails.hooks.pubsub) {
          Uploader.publishDestroy(
            pk, !req._sails.config.blueprints.mirror && req, {
              previous: record
            }
          );
          if (req.isSocket) {
            Uploader.unsubscribe(req, record);
            Uploader.retire(record);
          }
        }
        sails.log.info('Destroyed uploader: ', record);
        res.ok(record);
      }).error(res.negotiate);
    })
  },

  // POLICIES -> admin auth token
  // + curl -H "Content-Type: application/json" -X PUT -d '{"approved": "true"}' http://localhost:5014/api/uploader/:hex
  update: function (req,res) {
    // console.log("update");
    var params = req.allParams();
    var hex = params.id;
    if (!hex) return res.send("No id specified.");
    Uploader.update(hex, params, function(err, updated) {
      if (err) return res.send("Error on update " + id );
      if (updated.length == 0) return res.send("Not found " + id );
      res.json(updated);
    });
  },

};

