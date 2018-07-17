var user = userPool.getCurrentUser();

if (user != null) {
    location.href = "main.html";
} else {
    var searchParams = new URLSearchParams(location.search.slice(1));

    $(function() {
        if (searchParams.has("verified")) {
            $("#login_success").html("User verified successfully, you can now login.").removeClass("d-none").addClass("d-visible");
        }

        $("#loginSubmit").click(function(evt) {
            evt.preventDefault();

            var email = $("#login_email").val();
            var password = $("#login_password").val();

            var authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                Username: email,
                Password: password
            });

            var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
                Username: email,
                Pool: userPool
            });

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: function (result) {
                    location.href = "main.html";
                },
                onFailure: function(err) {
                    $("#login_alert").html(err.message).removeClass("d-none").addClass("d-visible");
                }
            });
        });

        $("#registerSubmit").click(function(evt) {
            evt.preventDefault();
            var email = $("#register_email").val();
            var givenName = $("#register_given_name").val();
            var password = $("#register_password").val();
            var confirmPassword = $("#register_confirm_password").val();

            if (password != confirmPassword) {
                $("#register_alert").html("Password must match").removeClass("d-none").addClass("d-visible");
            } else {
                var attributeGivenName = new AmazonCognitoIdentity.CognitoUserAttribute({
                    Name: "given_name",
                    Value: givenName
                });
                userPool.signUp(email, password, [attributeGivenName], null, function(err, result) {
                    if (err) {
                        $("#register_alert").html(err.message).removeClass("d-none").addClass("d-visible");
                    } else {
                        location.href = "verify.html?email="+email;
                    }
                });
            }
        });
    });
}