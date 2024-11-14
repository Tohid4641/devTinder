const sendConnRequest = async (req, res, next) => {
    const user = req.user;

    try {
        
        res.status(200).send(user.firstName +' '+ user.lastName + ' is sent you a connection request!');
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sendConnRequest
}