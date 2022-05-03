const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;

      next();
    });
  } catch (error) {
    return res.sendStatus(400).json({ error: { message: "Invalid request" } });
  }
};
module.exports = authenticateToken;
