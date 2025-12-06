const ReportServices = require("@services/admin/ReportServices");

const getReports = async (req, res, next) => {
  try {
    const { reportType } = req.params;

    const result = await ReportServices.getReports(reportType);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const confirmReport = async (req, res, next) => {
  try {
    const adminId = req.user.id;

    const { reportId, reportType, reportModels, lockedTime } = req.body;

    const result = await ReportServices.confirmReport(
      adminId,
      reportId,
      reportType,
      reportModels,
      lockedTime
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const cancelReport = async (req, res, next) => {
  try {
    const adminId = req.user.id;

    const { reportId, reportType } = req.body;

    const result = ReportServices.cancelReport(adminId, reportId, reportType);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
  confirmReport,
  cancelReport,
};
