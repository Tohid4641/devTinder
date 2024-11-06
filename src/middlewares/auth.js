const adminAuth = (req, res, next) => {
    const token = 'xyz';

    if(token === "xyz"){
        next()
    }

    res.status(401).json({
        "message": "Unauthorized Admin!!"
    });
}

const userAuth = (req, res, next) => {
    const token = 'abc';

    if(token === "abc"){
        next()
    }

    res.status(401).json({
        "message": "Unauthorized User!!"
    });
}

module.exports = {
    adminAuth,userAuth
}