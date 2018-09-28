var AWS = require("aws-sdk");

exports.handler = async (event) => {
    var claims = event.requestContext.authorizer.claims;
    var sub = claims.sub;
    var ddb = new AWS.DynamoDB();
    var params = {
        TableName: "todo_items",
        KeyConditionExpression: "user_id = :userId",
        ExpressionAttributeValues: {
            ":userId": {
                S: sub
            }
        }
    };

    try {
        var results = await ddb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(formatResponse(results)),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }
    }
};

function formatResponse(results) {
    var response = [];

    if (results.Items.length > 0) {
        var items = results.Items;
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            response.push({
                uuid: item.uuid.S,
                user_id: item.user_id.S,
                description: item.description.S,
                timestamp: item.timestamp.N
            });
        }
    }

    return response;
}