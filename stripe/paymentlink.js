require("dotenv").config();
const Joi = require("joi");
const { PriceValidationSchema } = require("./price");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// uff pretty darm complex object schema to modelate

//model a single object with properties
let single_line_item_schema = Joi.object().keys({
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required,
});

//model array of objects
let line_items_array = Joi.array().items(single_line_item_schema);

//model global object
const PaymentLinkValidationSchema = Joi.object().keys({
  line_items: line_items_array,
  after_completion: Joi.object().keys({
    type: Joi.string().allow("redirect"),
    redirect: Joi.object().keys({
      url: Joi.string().uri(),
    }),
  }),
});

const createPaymentLink = async ({ payload }) => {
  const paymentLink = await stripe.paymentLinks.create({
    line_items: payload.line_items,
    after_completion: payload.after_completion,
  });
};

console.log(PaymentLinkValidationSchema.validate(test));
