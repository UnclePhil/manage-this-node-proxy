# manage-this-node-proxy

Variant of [manage-this-node](https://github.com/onedr0p/manage-this-node)

This version can also act as proxy for backends who are not directly accessible by the user.  

Ex: join isolated services in docker environment

Due to *my* usage as proxy in docker environment, *I decide* to remove all settings & commits features.

The configuration is, for the moment, only in manual (or docker generated) mode

## Getting Started
### Prerequisites
- [Node.js](http://nodejs.org) v4.2.x
- [Git](https://git-scm.com/downloads) (optional)

### Installation

```bash
# Clone the repository or download the ZIP and extract it
git clone https://github.com/unclephil/manage-this-node-proxy
```

```bash
# Install dependencies
cd manage-this-node-proxy
npm install
```

### Upgrading
It's a good idea to run `npm install` to avoid any problems.

### Configuration

```bash
# Copy config.json.template to config.json
cp config.json.template config.json
vi config.json
```

Basic auth is available by passing `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` through environment variables.

```bash
BASIC_AUTH_USER=user BASIC_AUTH_PASSWORD=password npm start
```
see also enhancement

### Start the app

```bash
# Start the app
npm start
```
Open `localhost:3000` in your browser to see the app.

Or use PM2 to run it ala forever

### Docker
A dockerfile will be provided when app will be in production mode

App Specific Workarounds
---------------
**Emby**  
By Default Emby sends a header that prevents loading in an iframe.   


Additional Information
---------------
This version was create as frontend for a docker installation with multiple http/https bundled as one tools.

Enhancements
--------------
* RBAC is coming
* API to add services 
* Docker/swarm generated config (maybe embedded in the application)
* Additional static pages (because i need it)

SECURITY FEATURES
--------------
Be careful, due to some "difficulties" to allow usage of selfsigned certificates on backend, I use the following environment settings

```node
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
```

Who's totaly unsecure for the whole node.js environment.

But..... now you know it !!!!

If you have some idea to avoid this, you're welcome.

