window.app_coreui.config(function (ApiProvider) {
    ApiProvider._endpoint = 'http://192.168.77.253:8000';
    ApiProvider._token = '77fc647a3c0242b0a76640382d77c604-sha512-48abda00f1-5531cbc822de7a6cc4e215d67a994b83779d3edd6707ba20b8f815a0afdcce449fd6e8c056270bc22ec05a61ee553bf6da08b54a02a6ba29a92855834b9539c6';
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
