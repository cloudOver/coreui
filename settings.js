window.app_coreui.config(function (ApiProvider) {
    ApiProvider._endpoint = 'http://192.168.77.253:8000';
    ApiProvider._token = 'f7cef3fe19e94e76ae432010950fe56f-sha512-4bb4b4f075-c3e7e343e9eb5e624144a6134f0d14bb1cbbd200680c9d0131c6f14439b3a81be7d6b9706dc77181ec03db43337b46c8a6043f67a66e38ab17de34d1c93265f8';
    ApiProvider._login = 'xxx';
    ApiProvider._password = 'qqq';
});
///////////////////////////

window.coreUrl = "https://demo.cloudover.io:8443/";
window.vncHost = "demo.cloudover.io";
window.vncPort = 8443;
window.vncPrefix = "/webvnc/";

window.debug = false;

// Installed applications. Put 'home' controller at end of this list. Otherwise, it will catch all urls
window.modules = ['home', 'vm', 'image', 'network', 'coretalk', 'account', 'coredhcp', 'corevpn', 'thunderscript'];
