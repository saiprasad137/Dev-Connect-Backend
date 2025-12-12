# DevTinder API's

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password //Forgot password API

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

<!-- - POST /request/send/:status/:userId -->

- POST /request/review/accepted/:reqId
- POST /request/review/rejected/:reqId

<!-- - POST /request/review/:status/:reqId -->

##  userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform



Status : ignore , interested , accepted , rejected