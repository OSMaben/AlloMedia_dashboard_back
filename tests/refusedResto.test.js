// code npx jest tests/refusedResto.test.js
const { refusedResto } = require("../controller/admin/resto.controller");
const RestoModel = require("../model/Resto.model");

jest.mock("../model/Resto.model");

describe("refusedResto function", () => {
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
  });

  it("should refused restaurant successfully", async () => {
    const id = req.params.id;
    RestoModel.findByIdAndDelete.mockResolvedValue(id);

    await refusedResto(req, res);

    expect(RestoModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant successfully refused",
    });
  });

  it("should return 404 if restaurant not found", async () => {
    RestoModel.findByIdAndDelete.mockResolvedValue(null);

    await refusedResto(req, res);

    expect(RestoModel.findByIdAndDelete).toHaveBeenCalledWith("restaurant_id");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant not found",
    });
  });

  it("should handle errors during deletion", async () => {
    RestoModel.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

    await refusedResto(req, res);

    expect(RestoModel.findByIdAndDelete).toHaveBeenCalledWith("restaurant_id");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while refusing the restaurant",
      error: "Database error",
    });
  });
});
