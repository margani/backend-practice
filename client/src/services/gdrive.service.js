import google from "googleapis";
import config from "../config";

export default GoogleDriveService = {
  OAuth2Client: {},
  GDriveService: {},
  Scopes: ["https://www.googleapis.com/auth/drive"],
  Authorize() {
    this.OAuth2Client = new google.auth.OAuth2(
      config.GDriveClientId,
      config.GDriveClientSecret,
      config.GDriveClientRedirectUri
    );

    this.GDriveService = google.drive({
      version: "v3",
      auth: this.OAuth2Client
    });
  },
  isAuthorized() {
    return Object.keys(this.OAuth2Client.credentials).length > 0;
  },
  getAccessToken(code, callback) {
    var self = this;
    this.OAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log("ERROR HERE");
        return callback(err);
      }

      self.OAuth2Client.setCredentials(token);

      callback();
    });
  }
};
