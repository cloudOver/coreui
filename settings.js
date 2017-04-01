window.coreUrl = "http://workshops.cloudover.io:8000/";
window.vncHost = "demo.cloudover.io";
window.vncPort = 8443;
window.vncPrefix = "/webvnc/";

window.debug = false;

// Installed applications. Put 'home' controller at end of this list. Otherwise, it will catch all urls
window.modules = ['home', 'vm', 'image', 'network', 'coretalk', 'account', 'coredhcp', 'corevpn', 'thunderscript'];
