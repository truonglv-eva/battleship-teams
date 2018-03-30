/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {
  sails.models.appsettings.find().exec(function (error, records) {
    if (error) {
      let errMsg = 'Cannot load AppSettings data';
      let errObj = { "warn": errMsg, "data": error, "class": "config/bootstrap.js" };
      sails.log.warn(errObj);
    }
    records.forEach(function (setting) {
      sails.config.app.settings[setting.key] = setting.value;
      if (setting.key == "FLEET7") {
        sails.config.app.OUR_FLEET = setting.value;
      }
    });
    sails.log.debug("AppSettings = " + JSON.stringify(sails.config.app.settings));
  });
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
