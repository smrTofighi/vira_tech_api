const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");

    // بررسی وجود هدر Authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Not authenticated. Authorization header missing." });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    let decodedToken;

    try {
        // اعتبارسنجی توکن
        decodedToken = jwt.verify(token, "somesupersecretsecret");
    } catch (error) {
        // بررسی منقضی شدن توکن
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "ورود شما منقضی شده است. مجددا وارد شوید" });
        }

        // بررسی سایر خطاهای مرتبط با JWT
        return res.status(500).json({ message: "Failed to authenticate token.", error: error.message });
    }

    // اگر توکن نامعتبر بود
    if (!decodedToken) {
        return res.status(401).json({ message: "Not authenticated. Invalid token." });
    }

    // ذخیره اطلاعات کاربر در درخواست
    req.userId = decodedToken.userId;
    next();
};
