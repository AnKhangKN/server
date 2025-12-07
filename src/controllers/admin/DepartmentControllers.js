const DepartmentServices = require("@services/admin/DepartmentServices");

const createDepartment = async (req, res, next) => {
  try {
    const { departmentName, departmentCode } = req.body;

    const result = await DepartmentServices.createDepartment(
      departmentName,
      departmentCode
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const result = await DepartmentServices.getDepartments();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
};
