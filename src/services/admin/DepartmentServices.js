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

  async updateDepartment(departmentId, departmentName, departmentCode) {
    const department = await Department.findByIdAndUpdate(
      departmentId,
      {
        departmentName,
        departmentCode,
      },
      { new: true } // trả về dữ liệu mới nhất
    );

    if (!department) {
      return {
        message: "Phòng ban không tồn tại",
        data: null,
      };
    }

    return {
      message: "Cập nhật thành công",
      data: department,
    };
  }
}

module.exports = new DepartmentServices();
