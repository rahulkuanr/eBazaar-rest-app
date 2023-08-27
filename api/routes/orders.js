const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET Requests to /orders",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Handling POST Requests to /orders",
  });
});

router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
      message: "your order",
      id: req.params.orderId,
    });
});

router.delete("/:orderId", (req, res, next) => {
    res.status(200).json({
      message: "Order deleted"
    });
});

module.exports = router;
