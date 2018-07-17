var user = userPool.getCurrentUser();
var attributeMap = {};
var userSession = null;

var apigClient = apigClientFactory.newClient();

if (user == null) {
    location.href = "index.html";
} else {
    user.getSession(function(err, session) {
        userSession = session;
        user.getUserAttributes(function(err, result) {
            if (err) {
                console.error(err);
            } else {
                for (var i=0;i<result.length;i++) {
                    var attribute = result[i];
                    attributeMap[attribute.Name] = attribute.Value;
                }
                
                $(function() {
                    $("#loggedin_name").html(attributeMap[configuration.DisplayAttributeName]);

                    $("#logout").click(function(evt) {
                        evt.preventDefault();
                        user.signOut();
                        location.href = "index.html";
                    });

                    $("#submit").click(function(evt) {
                        evt.preventDefault();
                        var description = $("#description").val();
                        description = description.trim();
                        
                        if (!description || description === "") {
                            $("#alert_error").html("Description is a required field.").removeClass("d-none").addClass("d-visible");
                        } else {
                            var additionalParams = {
                                headers: {
                                    "Authorization": userSession.getIdToken().getJwtToken()
                                }
                            };
    
                            var body = {
                                description: description
                            };
    
                            apigClient
                                .itemsCreateNewPut(null, body, additionalParams)
                                .then(function() {
                                    $("#alert_success").html("New item created successfully.").removeClass("d-none").addClass("d-visible");
                                    $("#description").val("");
                                    refreshList();
    
                                })
                                .catch(function(err) {
                                    $("#alert_error").html(err).removeClass("d-none").addClass("d-visible");
                                }); 
                        }
                    });

                    refreshList();
                });
                
            }
        });
    });
}

function refreshList() {
    var additionalParams = {
        headers: {
            "Authorization": userSession.getIdToken().getJwtToken()
        }
    };

    apigClient
        .itemsGetAllGet(null, null, additionalParams)
        .then(function(result) {
            var data = result.data;

            $("#task_list_table tbody").html("");

            for(var i=0;i<data.length;i++) {
                var item = data[i];
                var date = new Date(parseInt(item.timestamp));
                $("#task_list_table tbody").append(
                    $("<tr>").append(
                        $("<td>")
                            .append($("<p>").html(item.description))
                            .append(
                                $("<p>").append(
                                    $("<small>").html("Created on "+date.toString())
                                )
                            )
                            // .append($("<a>").addClass("delete-item").attr("href", "#").attr("data-uuid", item.uuid).html("Delete"))
                    )
                );
            }
        });
}
