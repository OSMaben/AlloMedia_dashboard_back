// code npx jest tests/acceptedResto.test.js
const { acceptedResto } = require("../controller/admin/resto.controller");
const RestoModel = require("../model/Resto.model");
const UserModel = require("../model/user.model");

jest.mock("../model/Resto.model");
jest.mock("../model/user.model");

describe("acceptedResto function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "restaurant_id" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    RestoModel.findById.mockClear();
    UserModel.findById.mockClear();
  });

  it("should accept a restaurant successfully", async () => {
    const mockResto = {
      _id: "restaurant_id",
      isAccepted: false,
      managerId: "manager_id",
      save: jest.fn(),
    };

    const mockManager = {
      _id: "manager_id",
      role: "user",
      save: jest.fn(),
    };

    RestoModel.findById.mockResolvedValue(mockResto);
    UserModel.findById.mockResolvedValue(mockManager);

    await acceptedResto(req, res);

    expect(RestoModel.findById).toHaveBeenCalledWith("restaurant_id");
    expect(mockResto.isAccepted).toBe(true);
    expect(mockResto.save).toHaveBeenCalled();
    expect(UserModel.findById).toHaveBeenCalledWith("manager_id");
    expect(mockManager.role).toBe("manager");
    expect(mockManager.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant successfully accepted",
    });
  });

  it("should return 404 if restaurant not found", async () => {
    RestoModel.findById.mockResolvedValue(null);

    await acceptedResto(req, res);

    expect(RestoModel.findById).toHaveBeenCalledWith("restaurant_id");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Restaurant not found" });
  });

  it("should return 400 if restaurant is already accepted", async () => {
    const mockResto = {
      _id: "restaurant_id",
      isAccepted: true,
      save: jest.fn(),
    };

    RestoModel.findById.mockResolvedValue(mockResto);

    await acceptedResto(req, res);

    expect(RestoModel.findById).toHaveBeenCalledWith("restaurant_id");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Restaurant is already accepted",
    });
  });

  it("should return 404 if manager not found", async () => {
    const mockResto = {
      _id: "restaurant_id",
      isAccepted: false,
      managerId: "manager_id",
      save: jest.fn(),
    };

    RestoModel.findById.mockResolvedValue(mockResto);
    UserModel.findById.mockResolvedValue(null);

    await acceptedResto(req, res);

    expect(RestoModel.findById).toHaveBeenCalledWith("restaurant_id");
    expect(UserModel.findById).toHaveBeenCalledWith("manager_id");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Manager not found" });
  });

  it("should return 500 if there is a server error", async () => {
    const errorMessage = "Database error";
    RestoModel.findById.mockRejectedValue(new Error(errorMessage));

    await acceptedResto(req, res);

    expect(RestoModel.findById).toHaveBeenCalledWith("restaurant_id");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while accepting the restaurant",
      error: errorMessage,
    });
  });
});
