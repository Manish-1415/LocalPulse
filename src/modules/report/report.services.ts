import ApiError from "../../utility/ApiError.js";
import Report from "./report.model.js";
import type { CreateReportView, UpdateReportView } from "./report.validation.js";


const reportService = {
    createReportEntry : async (reportInfoObj : CreateReportView, userId : string, postId : string) => {
        const reportPayload = {
            ...reportInfoObj,
            post : postId,
            reportedBy : userId
        }

        const report = await Report.create(reportPayload);

        if(!report) throw new ApiError(500, "Error Occurred While Creating the Report");

        return report;
    },

    // updateReportStatusEntry : async (userId : string, postId : string ,reportInfoObj : UpdateReportView, reportId :string) => {
    //     const updatedReport = await Report.findByIdAndUpdate(
    //         { _id : reportId, reportedBy : userId, post : postId},
    //         { $set : reportInfoObj },
    //         {new : true, runValidators : true}
    //     );

    //     if(!updatedReport) throw new ApiError(403, "Error Occurred while Updating the Report Or User is not authorized to perform this operation");

    //     return updatedReport;
    // },



    deleteReportEntry : async (postId  : string, userId : string, reportId : string) => {
        const deletedReport = await Report.findByIdAndDelete(
            {_id : reportId, post : postId, reportedBy : reportId}
        );

        if(!deletedReport) throw new ApiError(403, "Report Not Found or User is Not authorized for this Operation");

        return deletedReport;
    },

    getReportEntries : async (userId : string) => {
        const reports = await Report.find({reportedBy : userId}).sort({createdAt : -1}).populate("reportedBy", "name avatar").lean();

        if(reports.length === 0) return {status : false, message : "No reports till now"}

        return reports;
    }
}

export default reportService;