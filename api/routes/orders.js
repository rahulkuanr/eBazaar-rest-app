const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            product_url: `http://localhost:3000/products/${doc.product}`,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${doc._id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.product)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.product,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Order Stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          product_url: `http://localhost:3000/products/${result.product}`,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      if (!res.headersSent) {
        res.status(500).json({ error: err });
      }
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((order) => {
      if (order) {
        res.status(200).json({
          order: {
            _id: order._id,
            product: order.product,
            productUrl: `http://localhost:3000/products/${order.product}`,
            quantity: order.quantity,
          },
          request: {
            type: "GET",
            description: "Get all orders",
            url: "http://localhost:3000/orders",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id: id })
      .exec()
      .then((result) => {
        if (result.deletedCount === 1) {
          res.status(200).json({
            message: "Order Deleted",
            request: {
              type: "POST",
              description: "Create a new order",
              url: `http://localhost:3000/orders`,
              requestBody: { product: "ID", quantity: "Number" },
            },
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
});

module.exports = router;
