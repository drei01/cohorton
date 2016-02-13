## Cohorton
### A NodeJS cohort analytics framework

Cohorton is a simple event and analytics framework for node and mongodb. I wrote it to keep track of simple cohort metrics in several projects.

## Installation
Node, NPM and MongoDB are prerequisites of installation.

Clone the github project and run.
```
npm install
```

Followed by
```
node server
```

By default the server runs on port **7878**

## Example
A simple **GET** request is all that is needed to track an event
####Tracking an event
```
curl http://localhost:7878/event?userId=USER_ID&event=EVENT_TYPE&user_joined_at=EPOCH_DATE&via=REFERRER&info=JSON_DATA_OPTIONAL
```

####Retrieving metrics
Metrics can be received in json or html format for the specified number of days
```
curl http://localhost:7878/data?days=7&format=json|html
```

## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.


## License

A short snippet describing the license (MIT, Apache, etc.)