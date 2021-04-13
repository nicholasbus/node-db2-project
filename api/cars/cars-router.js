// DO YOUR MAGIC
const router = require("express").Router();
const Cars = require("./cars-model");
const {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
} = require("./cars-middleware");

router.get("/", async (req, res, next) => {
  try {
    const allCars = await Cars.getAll();
    res.status(200).json(allCars);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", checkCarId, (req, res) => {
  res.status(200).json(req.car);
});

router.post(
  "/",
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
  async (req, res, next) => {
    try {
      const newCar = await Cars.create(req.body);
      res.status(201).json(newCar);
    } catch (e) {
      next(e);
    }
  }
);

router.use((err, req, res, next) => {
  res.status(500).json({
    message: "There was an error",
    errorMessage: err.message,
  });
});

module.exports = router;
