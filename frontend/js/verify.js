var user = userPool.getCurrentUser();

if (user != null) {
    location.href = "main.html";
} else {
    var searchParams = new URLSearchParams(location.search.slice(1));

    if (!searchParams.has("email")) {
        location.href = "index.html";
    }

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: searchParams.get("email"),
        Pool: userPool
    });

    $(function() {
        if (searchParams.has("code")) {
            $("#verify_code").val(searchParams.get("code"));
        }

        $("#verifySubmit").click(function(evt) {
            evt.preventDefault();

            var code = $("#verify_code").val();

            cognitoUser.confirmRegistration(code, true, function(err, result) {
                if (err) {
                    $("#verify_alert").html(err.message).removeClass("d-none").addClass("d-visible");
                } else {
                    location.href = "index.html?verified=1";
                }
            });
        });
    });
}