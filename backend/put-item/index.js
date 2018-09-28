var AWS = require("aws-sdk");
var uuid = require("node-uuid");

exports.handler = async (event) => {
    var claims = event.requestContext.authorizer.claims;
    var sub = claims.sub;
    var ddb = new AWS.DynamoDB();
    
    var body = JSON.parse(event.body);

    var params = {
        Item: {
            "uuid": {
                S: uuid.v4()
            },
            "user_id": {
                S: sub
            },
            "timestamp": {
                N: ""+Date.now()
            },
            "description": {
                S: body.description
            }
        },
        TableName: "todo_items"
    };

    try {
        await ddb.putItem(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }
    } catch(err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        }
    }
}