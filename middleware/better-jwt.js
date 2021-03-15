// 用户身份校验
const jwt = require("jsonwebtoken");
const allowRouters = ['/login', '/register', '/koa/login', '/koa/register', '/static/images'];
module.exports = async (ctx, next) => {
    if (allowRouters.indexOf(ctx.request.originalUrl) == -1) {
        const parts = ctx.header.authorization && ctx.header.authorization.split(' ');
        if (!parts) {
            ctx.body = {
                code: '401',
                msg: '您没有携带有效的token字符',
                data: null
            };
        } else {
            if (parts.length === 2) {
                const scheme = parts[0];
                const token = parts[1];
                if (/^Bearer$/i.test(scheme)) {
                    jwt.verify(token, '123456', { complete: true }, (err, decoded) => {
                        if (err) {
                            ctx.body = {
                                code: '401',
                                msg: '您的token字符无效或已过期',
                                data: null
                            };
                        } else {
                            ctx.state.user = decoded.payload
                        }
                    })
                }
            }
        }
    }
    await next()
};
