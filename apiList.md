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
- POST /api/request/send/interested/:userId
- POST /api/request/send/ignored/:userId
- POST /api/request/reqview/accepted/:requestId
- POST /api/request/reqview/rejected/:requestId

## userRouter
- GET /api/user/connections
- GET /api/user/requests
- GET /api/user/feed

## statuses
* ignored
* interested
* accepted
* rejected
