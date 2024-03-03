const jwt = require('jsonwebtoken')

//auth 

exports.auth = async (req, res, next) => {

    try {

        //get the token from the req body

        const token = req.header("Authorization").replace("Bearer", "");

        //token validation 

        if (!token) {
            return res.status(401), json({
                success: false,
                message: "JWT not found"
            })
        }

        //verify token

        try {
            const decode = await jwt.verify(token, 'johndoe99');
            req.user = decode;
        }

        catch (error) {
            return res.status(401), json({
                success: false,
                message: "Invalid Token"
            })
        }
        next();

    } catch (error) {
        return res.status(401), json({
            success: false,
            message: "Invalid Token"
        })
    }
}

//isStudent

exports.isStudent = async (req, res, next) => {
    try {

        if (req.user.role !== "student") {
            return res.status(500).json({
                success: false,
                message: "This section is just for students"
            })
        }

        res.status(200).json({
            success: true,
            message: "Hello, Student..."
        })

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "This section is only for students"
        })
    }
}

//isInstructor

exports.isInstructor = async (req, res, next) => {
    try {

        if (req.user.role !== "instructor") {
            return res.status(500).json({
                success: false,
                message: "This section is just for instructor"
            })
        }

        res.status(200).json({
            success: true,
            message: "Hello, instructor..."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "This section is only for instructor"
        })
    }

    next();
}

//isAdmin

exports.isAdmin = async (req, res, next) => {
    try {

        if (req.user.role !== "Admin") {
            return res.status(500).json({
                success: false,
                message: "This section is just for Admin"
            })
        }

        res.status(200).json({
            success: true,
            message: "Hello, Admin..."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "This section is only for Admin"
        })
    }

    next();
}




