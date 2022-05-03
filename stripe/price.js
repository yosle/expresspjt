require("dotenv").config();
const Joi = require("joi");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
/**
 * Note : This scheme isn't complete, api spec isnt clear in some
 * field what data type are. but required fields and other extra are included
 */
const PriceValidationSchema = Joi.object().keys({
  currency: Joi.string().max(3).lowercase().required(),
  product: Joi.string().required(),
  unit_amount: Joi.number().positive().required(),
  //Optional params
  active: Joi.boolean(), //true as default
  nickname: Joi.string(),
  metadata: Joi.object(),
  recurring: Joi.object(),
  product_data: Joi.object(),
  tax_behavior: Joi.allow("inclusive", "exclusive", "unspecified"),
  tiers: Joi.object(),
});

const createPriceObject = async (priceObj) => {
  const price = await stripe.prices.create({
    unit_amount: priceObj.unit_amount,
    currency: priceObj.currency,
    recurring: priceObj.recurring,
    product: priceObj.product,
  });

  return price;
};

module.exports = { createPriceObject, PriceValidationSchema };
