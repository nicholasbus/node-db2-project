const Cars = require("./cars-model");
const vinValidator = require("vin-validator");

const checkCarId = async (req, res, next) => {
  try {
    const car = await Cars.getById(req.params.id);
    if (!car) {
      res
        .status(404)
        .json({ message: `car with id ${req.params.id} is not found` });
    } else {
      req.car = car;
      next();
    }
  } catch (e) {
    next(e);
  }
};

const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage } = req.body;
  if (
    vin === undefined ||
    make === undefined ||
    model === undefined ||
    mileage === undefined
  ) {
    switch (true) {
      case vin === undefined:
        res.status(400).json({ message: "vin is missing" });
        break;
      case make === undefined:
        res.status(400).json({ message: "make is missing" });
        break;
      case model === undefined:
        res.status(400).json({ message: "model is missing" });
        break;
      case mileage === undefined:
        res.status(400).json({ message: "mileage is missing" });
        break;
      default:
        next();
    }
  } else {
    next();
  }
};

const checkVinNumberValid = (req, res, next) => {
  if (vinValidator.validate(req.body.vin)) {
    next();
  } else {
    res.status(400).json({ message: `vin ${req.body.vin} is invalid` });
  }
};

const checkVinNumberUnique = async (req, res, next) => {
  const allCars = await Cars.getAll();
  allCars.forEach((car) => {
    if (car.vin === req.body.vin) {
      res.status(400).json({ message: `vin ${req.body.vin} already exists` });
    }
  });
  next();
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
};
