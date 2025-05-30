const httpMocks = require("node-mocks-http");
const ErrorResponse = require("@MEUtils/errorResponse");
const AcademicClass = require("@MEModels/academicClassModel");

const {
  addAcademicClass,
} = require("@MEControllers/academicClassController/academicClassController");
const {
  academicClassPostRequestFail,
  academicClassPostRequestSuccess,
  duplicateField,
} = require("@MEHelpers/responseMessage");

describe("POST /academic-classes: 201 Success", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "POST",
      body: { academic_class: "nursery" },
      user: { id: "680bd9190cdc2f91c9b42b0e" },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Success: Should call if academic class is not exists in DB", async () => {
    jest.spyOn(AcademicClass, "findOne").mockResolvedValue(null);
    jest.spyOn(AcademicClass, "create").mockResolvedValue({
      id: "680bd9190cdc2f91c9b42b0e",
      academic_class: "nursery",
      is_active: true,
      _doc: { is_active: true, __v: 0 },
      populate: jest.fn().mockResolvedValue({
        created_by: "superAdmin",
        updated_by: "superAdmin",
        _doc: { is_active: true, __v: 0 },
      }),
    });

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.create).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().status).toBe(201);
    expect(Array.isArray(res._getJSONData().data)).toBe(true);
    expect(res._getJSONData().message).toBe(academicClassPostRequestSuccess);
  });

  it("Success: Should call if academic class exists and is_active is false", async () => {
    jest
      .spyOn(AcademicClass, "findOne")
      .mockResolvedValue({ id: "680bd9190cdc2f91c9b42b0e", is_active: false });
    jest.spyOn(AcademicClass, "findByIdAndUpdate").mockResolvedValue({
      id: "680bd9190cdc2f91c9b42b0e",
      academic_class: "nursery",
      is_active: true,
      _doc: { is_active: true, __v: 0 },
      populate: jest.fn().mockResolvedValue({
        created_by: "superAdmin",
        updated_by: "superAdmin",
        _doc: { is_active: true, __v: 0 },
      }),
    });

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().status).toBe(201);
    expect(Array.isArray(res._getJSONData().data)).toBe(true);
    expect(res._getJSONData().message).toBe(academicClassPostRequestSuccess);
  });
});

describe("POST /academic-classes: 400 Bad Request", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "POST",
      body: { academic_class: "nursery" },
      user: { id: "680bd9190cdc2f91c9b42b0e" },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Error: Should call next with error when findOne query fails", async () => {
    const unexpectedError = new Error(academicClassPostRequestFail);
    unexpectedError.statusCode = 400;

    jest.spyOn(AcademicClass, "findOne").mockRejectedValue(unexpectedError);

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(unexpectedError);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(academicClassPostRequestFail);
  });

  it("Error: Should call next with error when findByIdAndUpdate query fails", async () => {
    const unexpectedError = new Error(academicClassPostRequestFail);
    unexpectedError.statusCode = 400;

    jest
      .spyOn(AcademicClass, "findOne")
      .mockResolvedValue({ id: "680bd9190cdc2f91c9b42b0e", is_active: false });
    jest
      .spyOn(AcademicClass, "findByIdAndUpdate")
      .mockRejectedValue(unexpectedError);

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.findByIdAndUpdate).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(unexpectedError);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(academicClassPostRequestFail);
  });

  it("Error: Should call next with error when create query fails", async () => {
    const unexpectedError = new Error(academicClassPostRequestFail);
    unexpectedError.statusCode = 400;

    jest.spyOn(AcademicClass, "findOne").mockResolvedValue(null);
    jest.spyOn(AcademicClass, "create").mockRejectedValue(unexpectedError);

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.create).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(unexpectedError);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(academicClassPostRequestFail);
  });

  it("Error: Should call next with error when duplicate academic class error", async () => {
    const unexpectedError = new Error(duplicateField);
    unexpectedError.code = 11000;
    unexpectedError.statusCode = 400;
    jest.spyOn(AcademicClass, "findOne").mockResolvedValue(null);
    jest.spyOn(AcademicClass, "create").mockRejectedValue(unexpectedError);

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.create).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(duplicateField);
  });

  it("Error: Should call next with error when create query return null", async () => {
    jest.spyOn(AcademicClass, "findOne").mockResolvedValue(null);
    jest.spyOn(AcademicClass, "create").mockResolvedValue(null);

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.create).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(academicClassPostRequestFail);
  });
});

describe("POST /academic-classes: 400 Bad Request empty values", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      method: "POST",
      body: { academic_class: "" },
      user: { id: "680bd9190cdc2f91c9b42b0e" },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Error: Should call next with error when academic_class has empty value", async () => {
    const unexpectedError = new Error(academicClassPostRequestFail);
    unexpectedError.statusCode = 400;

    jest.spyOn(AcademicClass, "findOne").mockResolvedValue(null);
    jest.spyOn(AcademicClass, "create").mockRejectedValue(unexpectedError);

    await addAcademicClass(req, res, next);
    expect(AcademicClass.findOne).toHaveBeenCalled();
    expect(AcademicClass.create).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(academicClassPostRequestFail);
  });
});
