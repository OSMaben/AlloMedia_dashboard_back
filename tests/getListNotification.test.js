// tests/getListNotification.test.js
const { getListNotification } = require("../controller/admin/resto.controller");
const Notification = require("../model/notification.model");

jest.mock("../model/notification.model"); // Mock Notification model

describe("getListNotification function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        page: "1",
        limit: "10",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return notifications successfully", async () => {
    const mockNotifications = [
      {
        id: "1",
        message: "Notification 1",
        admin: true,
        createdAt: new Date(),
        mangerId: { name: "Manager 1", imgProfile: "img1.png" },
      },
      {
        id: "2",
        message: "Notification 2",
        admin: true,
        createdAt: new Date(),
        mangerId: { name: "Manager 2", imgProfile: "img2.png" },
      },
    ];
    
    Notification.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockNotifications),
          }),
        }),
      }),
    });

    Notification.countDocuments.mockResolvedValueOnce(5); 
    Notification.countDocuments.mockResolvedValueOnce(2);

    await getListNotification(req, res);

    expect(Notification.find).toHaveBeenCalledWith({ admin: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      notifications: mockNotifications,
      totalPages: 1,
      currentPage: "1",
      unreadCount: 2,
    });
  });

  it("should handle errors and return 500", async () => {
    Notification.find.mockImplementation(() => {
      throw new Error("DB error");
    });

    await getListNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "DB error",
    });
  });
});
