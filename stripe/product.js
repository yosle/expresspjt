require("dotenv").config();
const Joi = require("joi");

const ProductValidationSchema = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string().required(),
  active: Joi.boolean().optional(), //optional is default for Joi
  description: Joi.string().optional(),
  images: Joi.array(),
  livemode: Joi.boolean(),
  shippable: Joi.boolean().allow(null),
  package_dimensions: Joi.object().allow(null),
  statement_descriptor: Joi.string().allow(null),
  metadata: Joi.object(),
  tax_code: Joi.allow(null),
  unit_label: Joi.allow(null),
  url: Joi.string().max(128).allow(null),
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
/***
 * example object
 * 
 * {
 * "id": "prod_LcQi99KEPo1rD9",
 * "object": "product",
 * "active": true,
 * "created": 1651546368,
 * "description": null,
 * "images": [
 *   "http://localhost:3000/assets/images/https://res.cloudinary.com/gw-bootcamp/image/upload/v1651538877/sole-intentions2/Ugly_nx7dg3.png"
 * ],
 * "livemode": false,
 * "metadata": {},
 * "name": "Nike Dunk SB High x Concepts Ugly Christmas Sweater Grey",
 * "package_dimensions": null,
 * "shippable": null,
 * "statement_descriptor": null,
 * "tax_code": null,
 * "unit_label": null,
 * "updated": 1651546368,
 * "url": null
 *  }

 * description String (Optional)
 * 
 */

async function createNewProduct(product) {
  const newproduct = await stripe.products.create({
    name: product.name,
    description: product.description,
    images: product.images,
  });
  return newproduct;
}
module.exports = { createNewProduct, ProductValidationSchema };
