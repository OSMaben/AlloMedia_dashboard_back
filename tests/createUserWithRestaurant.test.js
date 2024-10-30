const {
  createUserWithRestaurant,
} = require("../controller/admin/resto.controller");
const UserModel = require("../model/user.model");
const RestoModel = require("../model/Resto.model");
const CreateToken = require("../util/createToken");
const HashPassword = require("../util/HashPassword");
const envoyerEmail = require("../util/mail");

jest.mock("../util/createToken.js");
jest.mock("../util/mail.js");
jest.mock("../util/HashPassword.js");
jest.mock("../model/user.model");
jest.mock("../model/Resto.model");

describe("createUserWithRestaurant function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        restoname: "exmpels",
        phone: "0645657689",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    HashPassword.mockClear();
    UserModel.create.mockClear();
    RestoModel.create.mockClear();
    CreateToken.mockClear();
    envoyerEmail.mockClear();
  });

  it("should create a manager and their restaurant, and send a confirmation email", async () => {
    const hashedPassword = "hashed_password";
    const token = "token";
    const user = {
      _id: "user_id",
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    };
    const resto = {
      _id: "resto_id",
      restoname: req.body.restoname,
      managerId: user._id,
      isAccepted: true,
    };

    HashPassword.mockResolvedValue(hashedPassword);
    UserModel.create.mockResolvedValue(user);
    RestoModel.create.mockResolvedValue(resto);
    CreateToken.mockReturnValue(token);
    envoyerEmail.mockResolvedValue(true);

    await createUserWithRestaurant(req, res);

    expect(HashPassword).toHaveBeenCalledWith("password123");
    expect(UserModel.create).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      phone: "0645657689",
      role: "manager",
      slug: expect.any(String),
      password: "hashed_password",
    });

    expect(RestoModel.create).toHaveBeenCalledWith({
      restoname: "exmpels",
      managerId: user._id,
      isAccepted: true,
    });

    expect(CreateToken).toHaveBeenCalledWith({ id: user._id }, "5m");

    const confirmationLink =
      "http://localhost:8080/api/auth/verifyAcount/" + token;

    const data = {
      userName: user.name,
      restaurantName: resto.restoname,
      confirmationLink,
    };

    expect(envoyerEmail).toHaveBeenCalledWith(
      user.email,
      "verfei accoute",
      `http://localhost:8080/api/auth/verifyAcount/${token}`,
      null,
      "VRA",
      data
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User and restaurant created successfully",
      user,
      restaurant: resto,
    });
  });

  it("should handle errors when creating a user", async () => {
    UserModel.create.mockRejectedValue(new Error("Database error"));

    await createUserWithRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while creating the user and restaurant",
      error: "Database error",
    });
  });

  it("should handle errors when creating a restaurant", async () => {
    RestoModel.create.mockRejectedValue(new Error("Database error"));

    await createUserWithRestaurant(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while creating the user and restaurant",
      error: "Database error",
    });
  });
});
