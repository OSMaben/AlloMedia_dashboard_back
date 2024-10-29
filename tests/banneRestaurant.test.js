const { banneRestaurant } = require("../controller/admin/resto.controller");
const RestoModel = require("../model/Resto.model");

jest.mock("../model/Resto.model");

describe("banneRestaurant function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "restaurant_id",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    RestoModel.findByIdAndUpdate.mockClear();
  });

  it("should successfully ban the restaurant temporarily", async () => {
    const id = req.params.id;

    const mockResto = {
      _id: id,
      isVisible: false, // The restaurant is not visible after banning
    };

    // Simulate a successful database update
    RestoModel.findByIdAndUpdate.mockResolvedValue(mockResto);

    await banneRestaurant(req, res);

    expect(RestoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { isVisible: false }, // The restaurant is being banned
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant has been banned successfully", // Success message for banning
      restaurant: mockResto,
    });
  });

  it("should return 404 if the restaurant is not found", async () => {
    const id = req.params.id;

    // Simulate a case where the restaurant is not found
    RestoModel.findByIdAndUpdate.mockResolvedValue(null);

    await banneRestaurant(req, res);

    expect(RestoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { isVisible: false }, // Banning the restaurant
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant not found", // Not found message
    });
  });

  it("should return 500 if there is a server error", async () => {
    const id = req.params.id;

    // Simulate a server error
    const errorMessage = "Database error";
    RestoModel.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

    await banneRestaurant(req, res);

    expect(RestoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { isVisible: false }, // Attempting to ban the restaurant
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while banning the restaurant", // Error message
      error: errorMessage,
    });
  });
});
