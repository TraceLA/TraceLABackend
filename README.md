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

> npm install 

> npm run dev 

> psql -U username -h nameOfRemoteServer -p 5432 dbname  

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
GET /aggregateResults
POST /results
```

## Retrieve results
```
GET /results
```
### Parameters
* username: optional
* onlyPositive
  * If set to 1, only returns positive results
* earliestDate
  * Only return results dated >= earliestDate (i.e. '2020-12-2')

## Retrieve positive results count by date
```
GET /aggregateResults
```
### Parameters
* None

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
GET /aggregateContactsByDate
GET /numContactsByUsername
GET /numContactsDistribution

POST /contacts
```

## Retrieve contacts
```
GET /contacts
```
### Parameters
* username: optional

## Retrieve contacts count by date
```
GET /aggregateCounts
```
### Parameters
* None

## Retrieve contacts count by username
```
GET /numContactsByUsername
```
### Parameters
* None

## Retrieve contacts count distribution
```
GET /numContactsDistribution
```
### Parameters
* None

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
GET /exposure/spots
GET /exposure/contacts
```

## Retrieve potential infection spots
```
GET /exposure/spots
```
### Parameters
* username: required

## Retrieve usernames of recent contacts who tested positive, along with date of last contact
```
GET /exposure/contacts
```
### Parameters
* username: required