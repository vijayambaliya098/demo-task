"use strict";

const Product = require("./product.model");
const httpStatus = require("http-status");
const APIResponse = require("../../helpers/APIResponse");

class ProductController {
  //create Product
  async createProduct(req, res, next) {
    try {
      const model = new Product(req.body);
      let response = await model.save();

      response = {
        ...JSON.parse(JSON.stringify(response)),
      };
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(response, "Product added successfully", httpStatus.OK)
        );
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error adding Product",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  //Product get by id
  async getProductById(req, res, next) {
    let id = req.params.id;

    try {
      let response = await Product.findById(id);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response,
              "Product fetched successfully",
              httpStatus.OK
            )
          );
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            {},
            "Product with the specified ID does not exists",
            httpStatus.BAD_REQUEST
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error getting Product",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  //get all Products
  async getAllProduct(req, res, next) {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const skip = (Number(page) - 1) * limit;
      const sort = req.query.sort ? req.query.sort : "createdAt";
      const orderby = req.query.orderby;
      const minCost = req.query.minCost;
      const maxCost = req.query.maxCost;
      const character = req.query.character;
      let filter = {};

      if (minCost && maxCost) {
        filter["cost"] = { $gte: minCost, $lte: maxCost };
      }

      if (character) {
        filter["productName"] = { $regex: `^${character}`, $options: "i" };
      }

      let sortObject = {};
      sortObject[sort] = orderby === "asc" ? 1 : -1;

      let response = await Product.findProduct(filter, limit, skip).sort(
        sortObject
      );

      const count = await Product.findProduct(filter).countDocuments();
      response = {
        data: response,
        count: count,
      };
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            response,
            "Product fetched successfully",
            httpStatus.OK
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            {},
            "Error getting Product",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }

  //update Product
  async updateProductById(req, res, next) {
    try {
      const body = req.body;
      const response = await Product.update(body);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              response,
              "Product updated successfully",
              httpStatus.OK
            )
          );
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            {},
            "Product with the specified ID does not exists",
            httpStatus.BAD_REQUEST
          )
        );
    } catch (e) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error updating Product",
            httpStatus.INTERNAL_SERVER_ERROR,
            e
          )
        );
    }
  }

  //delete Note by id
  async deleteProductById(req, res, next) {
    const productId = req.params.id;
    try {
      let response = await Product.delete(productId);
      if (response) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse({}, "Product deleted successfully", httpStatus.OK)
          );
      }
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            {},
            "Product with the specified ID does not exists",
            httpStatus.BAD_REQUEST
          )
        );
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Error deleting Product",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  }
}

var exports = (module.exports = new ProductController());
