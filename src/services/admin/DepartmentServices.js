const Department = require("@models/Department");

class DepartmentServices {
  async createDepartment(departmentName, departmentCode) {
    const department = await Department.create({
      departmentName,
      departmentCode,
    });

    return {
      message: "Tạo khoa thành công!",
      data: department,
    };
  }

  async getDepartments() {
    const department = await Department.find().sort({ createdAt: -1 });

    return {
      message: "Lấy dữ liệu khoa thành công",
      data: department,
    };
  }
}

module.exports = new DepartmentServices();
