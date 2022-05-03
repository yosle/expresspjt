require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

require("./stripe/product");
const authenticateToken = require("./middleware/authenticatetoken");

const {
  createNewProduct,
  ProductValidationSchema,
} = require("./stripe/product");

const { PriceValidationSchema, createPriceObject } = require("./stripe/price");

app.use(express.json());

//this must be saved in the database (all the active refresh tokens)
//because this var will be loose every time server restart
let refreshTokensList = [];

/**
 *
 * users profile data
 */
const usersList = [
  {
    username: "yosle",
    email: "yosledev@gmail.com",
  },
  {
    username: "root",
    email: "123",
  },
];

/**
 * post to create a new product
 * returns a product created or error
 * header Authorization Bearer <token>
 * header Content-Type: application/json
 * body { product } // see product.js for the schema
 */
app.post(
  "/api/v1/prices/",
  /*authenticateToken*/ (req, res) => {
    const result = PriceValidationSchema.validate(req.body);
    if (result.error) {
      res
        .status(400)
        .send(
          "Bad request " +
            result.error.details[0].message +
            JSON.stringify(req.body)
        ); //it be great show all errors, not just the first
    }

    //todo : handling properly any stripe error
    try {
      //stripe
      createPriceObject({
        unit_amount: req.body.unit_amount,
        currency: req.body.currency,
        recurring: req.body.recurring,
        product: req.body.product, //product key like  prod_LcWzJysKIf9iCL
      });
    } catch (error) {
      res
        .status(500)
        .send({ error: { message: "Remote Stripe Error " + error.message } });
    }
  }
);

/**
 * Create a new product
 */
app.post(
  "/api/v1/products/",
  /*authenticateToken*/ (req, res) => {
    const result = ProductValidationSchema.validate(req.body);
    if (result.error) {
      res
        .status(400)
        .send(
          "Bad request " +
            result.error.details[0].message +
            "\n Your request: \n" +
            JSON.stringify(req.body)
        ); //it be great show all errors, not just the first
    }

    //todo : handling properly any stripe error
    try {
    } catch (error) {
      res
        .status(500)
        .send({ error: { message: "Stripe Error " + error.message } });
    }
  }
);

app.get("/api/v1/services/:serviceID", (req, res) => {
  console.log(req.params.serviceID);
  //res.json(post.filter((post) => post.username === req.user.name));
  res.status(200).send("ok");
});

//Token refresh
app.post("/api/v1/accounts/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log(refreshToken);
  if (refreshToken == null) return res.sendStatus(401);

  if (!refreshTokensList.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json(accessToken);
  });
});
/**
 *
 * example post request
 * {
 * "email":"ejemplo@git.com",
 * "password":"123"
 * }
 *
 */
app.post("/api/v1/accounts/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //todo : validate rquest format with joi
  if (!email) return res.sendStatus(400);

  const user = { email: email, password: password };

  //serialize
  accessToken = generateAccessToken(user);

  //refractor this
  const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  refreshTokensList.push(refreshToken);

  res.json({ token: accessToken, refreshtoken: refreshToken });
});

//helper function
const generateAccessToken = (user) => {
  return (accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  }));
};

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("🚀 Listening server in port", port);
});
