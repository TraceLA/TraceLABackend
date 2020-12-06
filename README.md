# Getting Started

> git clone https://github.com/TraceLA/TraceLABackend.git

Create a `.env` file with the following keys:
```
PGHOST=[SECRET_VALUE]
PGDATABASE=[SECRET_VALUE]
PGUSER=[SECRET_VALUE]
PGPORT=[SECRET_VALUE]
PGPASSWORD=[SECRET_VALUE]
MAPQUESTKEY=[SECRET_VALUE]
```

> npm install # install a local copy of the node modules.
> npm run dev # set up nodemon so you don't have to turn off and on the server for on the backend.
> psql -U username -h nameOfRemoteServer -p 5432 dbname  # access remote database

# Authentication

All POST requests require an api-key in the authorizaiton header:
```
key: api-key
value: your_api_key
```

# HTTP Status Codes:
* 200 - OK. Everything worked as expected.
* 400 - Bad Request. The request was unacceptable, often due to missing a required parameter.
* 401 - Unauthorized. For intance, no valid API key provided.
* 402 - Request Failed. The parameters were valid but the request failed.
* 403 - Forbidden. The API key doesn't have permissions to perform the request.
* 404 - Not Found. The requested resource doesn't exist.
* 429 - Too Many Request. Too many requests hit the API too quickly.
* 500, 502, 503, 504 - Server Errors	

(Source: https://stripe.com/docs/api/errors)


# User

## Endpoints
```
GET /users
POST /userLogin
POST /users
POST /userPrivacy
```

## Login a user
```
POST /userLogin
```
### Parameters
* username: required
* password: required

Response:
```
{
    "api_key": "your_api_key"
}
```

## Add a user
```
POST /users
```
### Parameters
* first_name: required
* last_name: required
* username: required
* password: required
* email: required
* studentid: required

## Retrieve users
```
GET /users
```
Parameters:
* first_name: optional
* last_name: optional
* username: optional

## Update User Privacy
```
POST /userPrivacy
```
Parameters:
* allowSharing: required
  * If set to 1, location data is available for others to view
  * If set to 0, location data is kept private, only available to users with admin privilege

# Coordinates

## Endpoints
```
GET /coords
POST /coords
```

## Retrieve coordinates
```
GET /coords
```
### Parameters
* username: optional
* justLocation: optional
  * If set to "true", does not return usernames

## Add coordinate
```
POST /coords
```
### Parameters
* lat: required
* long: required


# Friends
## Endpoints
```
GET /friends/
POST /friendRequest
POST /friendRequest/confirm
```

## Retrieve friends
```
GET /friends/
```
### Parameters
* username: required
* confirmed: optional
  * If "true," returns only confirmed friend requests.
  * If "false," returns only unconfirmed friend requests.
  * If not set, returns both confirmed and unconfirmed friend requests
* reverse: optional
  * If "true," returns friend requests made to the given username

## Make friend request
```
POST /friendRequest
```
### Parameters
* friend_username: required

## Confirm friend request
```
POST /friendRequest/confirm
```
### Parameters
* friend_username: required
* reject: optional
  * If set to "true," rejects the friend request

# Test Results 

## Endpoints
```
GET /results
POST /results
```

## Retrieve results
```
GET /results
```
### Parameters
* username: required

## Add results
```
POST /results
```
### Parameters
* username: required
* result: required
  * "true" or "false"
* date: required

# Contacts

## Endpoints
```
GET /contacts
POST /contacts
```

## Retrieve contacts
```
GET /contacts
```
### Parameters
* username: optional


## Add contact
```
POST /contacts
```
### Parameters
* other_username: required
* location: required
* date: required


# Exposure
## Endpoints
```
GET /exposure
GET /exposure/contacts
```

## Retrieve potential infection spots
```
GET /exposure/
```
### Parameters
* username: required

## Retrieve recent contacts who tested positive
```
GET /exposure/contacts
```
### Parameters
* username: required