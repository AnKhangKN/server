const Group = require("@models/Group");
const Post = require("@models/Post");
const Report = require("@models/Report");
const User = require("@models/User");
const throwError = require("../../utils/throwError");

class ReportServices {
  async getReports(reportType) {
    const reports = await Report.find({ reportType: reportType })
      .populate("reportUser", "email")
      .populate("reportModels", "_id email lockCount lockedTime")
      .populate("handledBy", "email");
    return { data: reports };
  }

  async confirmReport(adminId, reportId, reportType, reportModels, lockedTime) {
    let target;
    const report = await Report.findById(reportId);
    if (!report) throwError("Report không tồn tại!", 400);

    // Xác nhận report
    report.handledBy = adminId;
    report.isConfirm = true;

    if (reportType === "Post") {
      target = await Post.findById(reportModels);
      if (!target) throwError("Bài post không tồn tại!", 400);

      target.status = "locked";
      await target.save();
    } else if (reportType === "User") {
      target = await User.findById(reportModels);
      if (!target) throwError("Người dùng không tồn tại!", 400);

      // Tăng lockCount trước
      target.lockCount = (target.lockCount || 0) + 1;

      if (target.lockCount >= 5) {
        // Khóa vĩnh viễn
        target.lockedTime = new Date("9999-12-31T23:59:59Z");
      } else {
        // Khóa theo thời gian do admin chọn
        target.lockedTime = new Date(
          Date.now() + lockedTime * 24 * 60 * 60 * 1000
        );
      }
      await target.save();
    } else if (reportType === "Group") {
      target = await Group.findById(reportModels);
      if (!target) throwError("Group không tồn tại!", 400);

      target.status = "locked";
      await target.save();
    } else {
      throwError("Report type không phù hợp để xử lý!", 401);
    }

    await report.save();

    return { message: `${reportType} đã được xử lý thành công!` };
  }

  async cancelReport(adminId, reportId, reportType) {
    // Kiểm tra report có tồn tại không
    const report = await Report.findById(reportId);
    if (!report) {
      throwError("Report không tồn tại!", 400);
    }

    // Nếu đã confirm/cancel rồi thì không cho xử lý lại
    if (report.isConfirm || report.isCancel) {
      throwError("Report này đã được xử lý trước đó!", 400);
    }

    // Hủy report
    report.handledBy = adminId;
    report.isCancel = true;
    await report.save();

    return {
      message: `Chúng tôi chưa thấy bất kì sai phạm gì với ${reportType} này!`,
    };
  }

  async removeReport(reportId, reportModels) {}
}

module.exports = new ReportServices();
