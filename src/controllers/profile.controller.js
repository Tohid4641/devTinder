const getProfile = async (req, res, next) => {
    const user = req.user;

    try {
        
        res.status(200).send(user);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProfile
}