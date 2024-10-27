const { getListrestaurants } = require("../controller/admin/resto.controller");
const RestoModel = require("../model/Resto.model");

jest.mock("../model/Resto.model");

describe("getListrestaurants function", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mocks before each test
    RestoModel.find.mockClear();
  });

  it("should return a list of accepted restaurants successfully", async () => {
    const mockRestaurants = [
      {
        isDeleted: false,
        isVisible: true,
        restoname: "Restaurant 1",
        type: "Italian",
        logo: "logo1.png",
      },
      {
        isDeleted: false,
        isVisible: true,
        restoname: "Restaurant 2",
        type: "Chinese",
        logo: "logo2.png",
      },
    ];

    // Mock the resolved value of find
    RestoModel.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(mockRestaurants),
    });

    await getListrestaurants(req, res);

    expect(RestoModel.find).toHaveBeenCalledWith({ isAccepted: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      restaurants: mockRestaurants, // Pass the restaurants directly
    });
  });

  it("should return 500 if an error occurs", async () => {
    RestoModel.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getListrestaurants(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "DB error",
    });
  });
});
