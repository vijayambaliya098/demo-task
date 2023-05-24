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
      const { page, limit } = req.query;
      const paginationFilter = {
        limit: Number(limit) || 10,
        skip: (Number(page) - 1) * limit,
      };
      const count = await Product.count({isActive: true})
      let response = await Product.findAll(
        paginationFilter
      );
     const newData = {
      products:response,
      count: count
     }
      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(
            newData,
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
