const ReportServices = require("@services/shared/ReportServices");

const createReport = async (req, res, next) => {
  try {
    const reportUser = req.user.id;

    const { reportType, reportModels, reason, reportContent } = req.body;

    const result = await ReportServices.createReport(
      reportType,
      reportModels,
      reportUser,
      reason,
      reportContent
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
};
