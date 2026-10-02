// Some ISPs (common on Windows home networks) fail to resolve mongodb+srv:// records,
// giving "querySrv ECONNREFUSED". Use public DNS for these local scripts.
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']); } catch { /* ignore */ }
