const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = "credentials.json";

var credentials = {};
/*
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  //authorize(JSON.parse(content), authorized_callback);
  credentials=JSON.parse(content);
  console.log(credentials);
});
*/
try {
  credentials = JSON.parse(fs.readFileSync("./client_secret.json", "utf8"));
} catch (err) {
  throw err;
}

var authorize = function(credentials) {
  //console.log(credentials);
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  const OAuth2Client = google.auth.OAuth2;

  this.scopes = SCOPES;
  this.oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
  service_drive = google.drive({ version: "v3", auth: this.oauth2Client });

  this.isAuthorised = function() {
    //console.log(this.oauth2Client.credentials);
    return Object.keys(this.oauth2Client.credentials).length > 0;
  };

  /*
   *	@param {String} authorizationCode
   *   @param {Function} callback
   */
  this.getAccessToken = function(code, callback) {
    var self = this;
    this.oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log("ERROR HERE");
        return callback(err);
      }

      self.oauth2Client.setCredentials(token);

      callback();
    });
  };

  this.getList = function(ID, callback) {
    service_drive.files.list(
      {
        auth: this.oauth2Client,
        pageSize: 10,
        q: "'" + ID + "' in parents and trashed=false",
        orderBy: "folder,modifiedTime desc,name"
      },
      function(err, res) {
        if (err) return console.log(err);

        callback(res.data.files);
      }
    );
  };

  this.downloadFile = function(ID, callback) {
    service_drive.files.get(
      {
        auth: this.oauth2Client,
        fields: "webContentLink , id, name,mimeType",
        fileId: ID
      },
      function(err, res) {
        //console.log(res.data);

        callback(res.data.webContentLink);
      }
    );
  };
};

module.exports = new authorize(credentials);
