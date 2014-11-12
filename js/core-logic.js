if ($.cookie("core_login") != null) {
    window.login = $.cookie("core_login");
    window.pw_hash = $.cookie("core_pw_hash");
    request("/user/token/get_list/", {login: $.cookie("core_login"), pw_hash: $.cookie("core_pw_hash"), name: 'coreui'}, onlogin);
} else {
    $("#loginModal").modal('show');
    $("#loginModal").on('hidden.bs.modal', function(e) {
        if ($.cookie("core_login") === null) {
            $("#loginModal").modal('show');
        }
    });
}
$("#navbar").load("navbar.html");

function onlogin(tokens) {
    // If token named "coreui" exists, use it. Otherwise request to create it
    if (tokens.length > 0) {
        window.token = tokens[0].token;
    } else {
        request("/user/token/create/", {login: $.cookie("core_login"), pw_hash: $.cookie("core_pw_hash"), name: 'coreui'}, function (r) {
            window.token = r.token
        });
    }



    // Show all api modules and extensions in menu
    request("/api/api/list_api_modules/", {token: window.token}, function(r) {
        for (i = 0; i < r.length; i++) {
            $("#menu").append($('<div>').load("components/" + r[i] + "/menu.html"));
            $("#menu").append($('<br/>'));
            $("#controllers").append($('<div>').load("components/" + r[i] + "/controller.html"));
        }
    });
    // Finally, hide our modal
    $("#loginModal").modal('hide');
}

// On login
$("#loginSubmit").click(function(e) {
    request("/user/user/get_seed/", {"login": $("#loginUsername").val()}, function(response) {
        $.cookie("core_login", $("#loginUsername").val());
        $.cookie("core_pw_hash", $().crypt({method: "sha1", source: $("#loginPassword").val() + response.seed}));
        request("/user/token/get_list/", {login: $.cookie("core_login"), pw_hash: $.cookie("core_pw_hash"), name: 'coreui'}, onlogin);
    });
});


// On register
$("#loginRegister").click(function(e) {
    $("#loginRegister").removeClass("btn-default");
    $("#loginRegister").addClass("btn-warning");
    $("#loginRegisterForm").removeClass("hidden");
    $("#loginRegister").unbind("click");
    $("#loginRegister").click(function(e) {
        if ($("#loginPassword").val() != $("#loginPassword2").val()) {
            alert("Password missmatch");
            return;
        }
        request("/user/user/register/", {login: $("#loginUsername").val(),
                                         password: $("#loginPassword").val(),
                                         name: $("#loginName").val(),
                                         surname: $("#loginSurname").val(),
                                         email: $("#loginEmail").val(),
                                        }, function(r) {
                                            $.cookie("core_login", r.login);
                                            $.cookie("core_pw_hash", $().crypt({method: "sha1", source: $("#loginPassword").val() + r.pw_seed}));
                                            request("/user/token/get_list/", {login: $.cookie("core_login"), pw_hash: $.cookie("core_pw_hash"), name: 'coreui'}, onlogin);
        });
    });
});