# devtinder api's

## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## connectionrequestRouter
POST /request/send/interested/:userid
POST /request/send/ignored/:userid
POST /request/review/accepted/:reqID
POST /request/review/rejected/:reqID

## userRouter
GET /user/connection
GET /user/requests
GET /user/feed - gets profiles of other users on platform


<!-- status----ignore,interested,accepted,rejected -->
 