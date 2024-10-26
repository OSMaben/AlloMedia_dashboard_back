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
  });

  it("should delete restaurant successfully", async () => {
    const id = req.params.id;
    const resto = RestoModel.findByIdAndUpdate.mockResolvedValue(id);

    await banneRestaurant(req, res);

    expect(RestoModel.findByIdAndUpdate).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant has been banned successfully",
      restaurant: resto,
    });
  });


});
