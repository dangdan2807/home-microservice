const axios = require('axios');
const commonUtil = require('../utils/common.util');
require('dotenv').config();

const API_URL = process.env.API_URL;

class AuthMiddleware {
    verifyToken = async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy access token',
            });
        }
        try {
            const user = await axios.get(`${API_URL}/api/user/info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // if false
            if (!user.data.data || !user.data.data.id || commonUtil.isEmpty(user.data.data)) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token không hợp lệ',
                });
            }

            req.userId = user.data.data.id;

            next();
        } catch (error) {
            console.log(error);
            res.status(403).json({
                success: false,
                message: 'Token không hợp lệ',
            });
        }
    };
}

module.exports = new AuthMiddleware();
