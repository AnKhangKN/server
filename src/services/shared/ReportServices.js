const Report = require("@models/Report");
const throwError = require("../../utils/throwError");
const User = require("@models/User");

class ReportServices {
  async createReport(
    reportType,
    reportModels,
    reportUser,
    reason,
    reportContent
  ) {
    const now = new Date();

    // Nếu báo cáo USER
    if (reportType === "User") {
      // Lấy user bị báo cáo
      const user = await User.findById(reportModels);
      if (!user) throwError("Người dùng không tồn tại!", 400);

      // 1️⃣ Nếu user bị khóa → không ai được report
      if (user.lockedTime && user.lockedTime > now) {
        throwError("Người dùng này đang được xử lý, hãy chờ!", 400);
      }

      // 2️⃣ Lấy report MỚI NHẤT của chính người này
      const oldReport = await Report.findOne({
        reportModels,
        reportUser,
        reportType,
      })
        .sort({ createdAt: -1 }) // 💥 LẤY REPORT MỚI NHẤT
        .lean();

      // 3️⃣ Nếu report gần nhất chưa xử lý → chặn
      if (oldReport && !oldReport.isConfirm && !oldReport.isCancel) {
        throwError("Report trước của bạn chưa được xử lý. Hãy chờ!", 400);
      }
    }

    // Nếu không phải report USER
    if (reportType !== "User") {
      const reported = await Report.findOne({
        reportUser,
        reportType,
        reportModels,
      });

      if (reported) throwError(`Bạn đã báo cáo ${reportType} này rồi!`, 400);
    }

    // Tạo report mới
    const report = await Report.create({
      reportType,
      reportModels,
      reportUser,
      reason,
      reportContent,
    });

    return {
      message: `Đã báo cáo ${reportType} thành công!`,
      data: report,
    };
  }
}

module.exports = new ReportServices();
