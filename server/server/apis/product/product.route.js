const ProductController = require("./product.controller");
var router = require("express").Router();
const APIResponse = require("../../helpers/APIResponse");
const httpStatus = require("http-status");
const Joi = require("joi");

// create Product endpoint
router.post("/create", createProductValidate, ProductController.createProduct);

// get all Product endpoint
router.get("/", ProductController.getAllProduct);

// get Product by id endpoint
router.get("/:id", IDparamRequiredValidation, ProductController.getProductById);

// update Product by id endpoint
router.put("/update", updateValidate, ProductController.updateProductById);

// delete Product by id endpoint
router.delete("/:id", IDparamRequiredValidation, ProductController.deleteProductById);

const createProductValidation = Joi.object()
  .keys({
    productName: Joi.string().required().error(new Error("productName is required!")),
    cost: Joi.string().required().error(new Error("cost is required!")),
  })
  .unknown();

const updateValidation = Joi.object()
  .keys({
    _id: Joi.string().required().error(new Error("_id is required!")),
  })
  .unknown();

function createProductValidate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, createProductValidation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

function updateValidate(req, res, next) {
  const Data = req.body;
  Joi.validate(Data, updateValidation, (error, result) => {
    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
      return next();
    }
  });
}

function IDparamRequiredValidation(req, res, next) {
  if (req.params && req.params.hasOwnProperty("id")) {
    next();
  } else {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(
        new APIResponse(null, "id param not found", httpStatus.BAD_REQUEST)
      );
  }
}

module.exports = router;
