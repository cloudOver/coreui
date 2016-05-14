window.coreUrl = "http://demo.cloudover.io:8000/";
window.vncHost = "demo.cloudover.io";
window.vncPort = 8000;
window.vncPath = "/webvnc/";

window.debug = true;

// Installed applications. Put 'home' controller at end of this list. Otherwise, it will catch all urls
window.modules = ['vm', 'image', 'network', 'coretalk', 'account', 'home', 'coredhcp', 'corevpn'];
