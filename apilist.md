# DevTinder API's

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:reqId
- POST /request/review/rejected/:reqId

##  userRouter
- GET /user/connections
- GET /user/received
- GET /user/feed - Gets you the profiles of other users on platform



Status : ignore , interested , accepted , rejected