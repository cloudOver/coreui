window.app_coreui.config(function (ApiProvider) {
    ApiProvider._endpoint = 'http://192.168.77.253:8000';
    ApiProvider._token = 'c126efd19fa14c16bde27b19b39dfedf-sha512-33b35f496c-6bfacaa44fca796971e3e9a6b69abed102ecf765cd661bd3f52d6f44b04ec60b8af28eaad621213abb90d0719a2843108d14388fea2bf686cea28298f6d670d9';
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
