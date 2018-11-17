window.coreUrl = "https://workshops.cloudover.io:8443/";
window.vncHost = "workshops.cloudover.io";
window.vncPort = 8443;
window.vncPrefix = "/webvnc/";

window.debug = false;

// Installed applications. Put 'home' controller at end of this list. Otherwise, it will catch all urls
window.modules = ['home', 'vm', 'image', 'network', 'coretalk', 'account', 'coredhcp', 'corevpn', 'thunderscript'];
