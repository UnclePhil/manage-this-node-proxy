var fs = require('fs-extra');
var _  = require('lodash');

var configFile         = __dirname + '/../config.json';
var configFileTemplate = configFile + '.template';

var config;

/* 
  Current Config Version
  Update this when making changes to the config file.
  This allows for the config auto-migrater to work.
*/
var configVersion = 3;

try {
  config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} catch (err) {
  if (err.name === 'SyntaxError') {
    throw new Error('Invalid config file, please make sure the file is in JSON format.');
  }

  // config file not found
  if (err.code === 'ENOENT') {
    fs.copySync(configFileTemplate, configFile);
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  }
}

config.app.title   = process.env.APP_TITLE   || config.app.title   || 'Manage This!';
config.app.port    = process.env.APP_PORT    || config.app.port    || 3000;

// Migrate config to current layout
migrateConfig(config.app.version, config.services)

// Migrate config 
function migrateConfig(version, services) {
    if (version === configVersion) {
        return;
    }
    console.log("running migration")

    // Pre-version 1
    if (version === undefined && services === undefined) {
      var newConfig = [];
      console.log("Version: 0");
      // Backup config
      writeSave('.0.' + (new Date().getTime()) + ".bak", config);
      
      // Migrate to version 1
      newConfig.app = {title: config.app.title, port: config.app.port, version: 1};
      newConfig.services = [];
      _.forEach(config, function(n, key) {
        if (n.name !== undefined && n.url !== undefined && n.icon !== undefined) {
          newConfig.services.push({name: n.name, url: n.url, icon: n.icon, default: n.default});            
        }
      });
      config = newConfig;
      newConfig = null;
      version = 1;
      console.log("Migrated to version: 1");
    }
    
    // Version 0.5
    if (version === undefined && config.services.length > 0) {
      console.log("Version: 0.5");
      // Backup config
      writeSave('.0.5.' + (new Date().getTime()) + ".bak", config);
      
      // Migrate to version 1
      config.app.version = 1;
      version = 1;
      console.log("Migrated to version: 1");
    }
    
    // Version 1 =>2 
    if (config.app.version === 1) {
      console.log("Version: 1");
      // Backup config
      writeSave('.1.' + (new Date().getTime()) + ".bak", config);

      // Migrate to version 2
      config.app.version = 2;
      _.forEach(config.services, function(n, key) {
        config.services[key] = {
          "_id": (n._id || key), 
          name: n.name, 
          url: n.url, 
          icon: n.icon, 
          default: n.default, 
          sort: (n.sort || key),
          proxy: (n.proxy || false)
        };
      });
      
      version = 2;
      console.log("Migrated to version: 2");
    }

    // Version 2 => 3
    if (config.app.version === 2) {
      console.log("Version: 2");
      // Backup config
      writeSave('.1.' + (new Date().getTime()) + ".bak", config);

      // Migrate to version 3
      config.app.version = 3;
      config.app.insecure = false;
      _.forEach(config.services, function(n, key) {
        config.services[key] = {
          "_id": (n._id || key), 
          name: n.name, 
          url: n.url, 
          icon: n.icon, 
          default: n.default, 
          sort: (n.sort || key),
          proxy: (n.proxy || false)
        };
      });
      
      version = 3;
      console.log("Migrated to version: 3");
    }

    


    // Save new config
    writeSave(null,config);
}

// Prepare Config file to be saved
function save(title, port, version, services) {
  writeSave(null, {
    'app': {
      'title'   : title,
      'port'    : port,
      'version' : version,
      'urlbase' : "",
    },
    'services': services
  });
}

// Write config to file
// This allows for config backups as well.
function writeSave(name, config) {
  var file = __dirname + '/../config.json';
  if (name !== undefined && name !== null) {
      file = file + name;
  }

  console.log("file: " + file);
  fs.writeJsonSync(file, config, {},
    function (err) {
      console.log(err)
  });
}

module.exports = config;
