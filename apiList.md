# DevTinder API's

## authRouter
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout

## profileRouter
- GET /api/profile/view
- PATCH /api/profile/edit
- PATCH /api/profile/password

## connectionRequestRouter
- POST /api/request/send/:status/:userId
- POST /api/request/review/:status/:requestId

## userRouter
- GET /api/user/requests/received
- GET /api/user/connections
- GET /api/user/feed

## statuses
* ignored
* interested
* accepted
* rejected
