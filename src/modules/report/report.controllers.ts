import type { Request, Response } from "express";
import ApiResponse from "../../utility/ApiResponse.js";
import { createReportSchema, updateReportSchema, type CreateReportView, type UpdateReportView } from "./report.validation.js";
import reportService from "./report.services.js";


export const createReport = async (req : Request, res : Response) => {
    const postId : string = req.params.post_id as string;
    const reportInfoObj : CreateReportView = createReportSchema.parse(req.body);
    const userId : string = req.user?._id!;

    const report = await reportService.createReportEntry(reportInfoObj, userId, postId);

    return res
    .status(201)
    .json(new ApiResponse(201, "Report Generated Successfully", report));
}



// export const updateReportStatus = async (req : Request<{post_id:string, report_id : string}>, res : Response) => {
//     const userId : string = req.user?._id!;
//     const {report_id , post_id} = req.params;
//     const reportInfoObj : UpdateReportView = updateReportSchema.parse(req.body);

//     const updatedReport = await reportService.updateReportStatusEntry(userId, post_id ,reportInfoObj, report_id);

//     return res
//     .status(200)
//     .json(new ApiResponse(200, "Report Status Updated", updatedReport));
// }



export const deleteReport = async (req : Request<{post_id : string, report_id : string}>, res : Response) => {
    const {post_id, report_id} = req.params;
    const userId = req.user?._id!;

    const deletedReport = await reportService.deleteReportEntry(post_id, userId, report_id);

    return res
    .status(200)
    .json(new ApiResponse(200, "Report Deleted Successfully", {reportId : deletedReport._id}));
}



export const getReports = async(req : Request, res : Response) => {
    const userId : string = req.user?._id!;

    const reports = await reportService.getReportEntries(userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "Reports fetched Successfully", reports));
}