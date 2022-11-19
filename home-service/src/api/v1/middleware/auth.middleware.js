const axios = require('axios');
const commonUtil = require('../../../utils/common.util');
require('dotenv').config();

const API_URL = process.env.API_URL;

class AuthMiddleware {
    verifyToken = async (req, res, next) => {
        try {
            const source = req.headers['user-agent'];
            const token = req.header('Authorization').replace('Bearer ', '');
            if (!token) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy access token',
                });
            }
            const user = await axios.get(`${API_URL}/api/user/info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'user-agent': source,
                },
            });
            // const user = {
            //     data: {
            //         data: {
            //             id: 1,
            //         }
            //     }
            // } 

            // if false
            if (
                !user.data.data ||
                !user.data.data.id ||
                commonUtil.isEmpty(user.data.data)
            ) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token không hợp lệ',
                });
            }

            req.userId = user.data.data.id;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Access token không hợp lệ',
            });
        }
    };
}

module.exports = new AuthMiddleware();
