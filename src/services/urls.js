import CommentLog from "../pages/comment_log/CommentLog"
import { commentLogUrls } from "./urls/commetLogUrls"
import { reconUrls } from "./urls/reconUrls"
import { serviceUrls } from "./urls/serviceUrls"

export const urls = {...{
    "searchDispute": "Dispute/SearchAllPendingDispute?dispute=",
    "getUserPending": "Dispute/GetUserPending?userId=",
    "closeRevalidationDispute": "Dispute/CloseRevalidationDispute?dispute=",
    "getDispute": "Dispute/Get?disputeId=",
    
    
    "filterLoginReport": (_type, dateSelected) => `ISOC/LoginReport/?status=${_type}&date=${dateSelected[0]}&endDate=${dateSelected[1]}`,
    "myLoginReport": (staffId, _type, dateSelected) => `ISOC/StaffLoginReport/?staffId=${staffId}&status=${_type}&date=${dateSelected[0]}&endDate=${dateSelected[1]}`,
    "filterOpenItemsReport": (_type, dateSelected) => `Recon/OpenItemsReport/?status=${_type}&date=${dateSelected[0]}&endDate=${dateSelected[1]}`,

    "downloadSampleMerchantExcel": "/Admin/DownloadSampleMerchantExcel",
    "filterAudit": `/Admin/FilterAudit`,
    "getAuditActions": `/Admin/GetAuditActions`,
    "filterUsers": (_type, dateSelected) => `/Admin/FilterUsers/?filter=${_type}&date=${dateSelected[0]}&endDate=${dateSelected[1]}`,

    "dormantUsers": `Account/GetDormantUsers`,

    "ATMUploadExceptionFile": (staffId, password) => `Branch/UploadATMExceptionFile?staffId=${staffId}&password=${password}}`,

    //product paper
    "getEntity": (enityName) => `GetEntity/?entityName=${enityName}`,
    "addProductRegister": "AddProductRegister",
    "findProduct": (searchstring) => `searchProductRegister?searchstring=${searchstring}`,
    "generatefindProductExcel": (searchstring) => `generateSearchRegisterExcel?searchstring=${searchstring}`,
    "deleteEntity": (Id, entityName) => `DeleteEntity?Id=${Id}&entityName=${entityName}`,
    "getProduct": `GetProductRegister?Id=`,
    "updateProduct": "UpdateProductRegister",
    "getEntityNames": "GetEntityNames",
    "addEntity": (name, entityName, desc,FkeyId) => `AddEntity?name=${name}&entityName=${entityName}&desc=${desc}&FkeyId=${FkeyId}`,
    // adjustment file
    "AdjustmentFile": "AdjustmentFile/UploadFiles?_type=",
    "adjustmentFilePending":"AdjustmentFile/GetPending?_type=", 
    "adjustmentFileUploadTreatedFiles": "AdjustmentFile/UploadTreatedFiles?_type=",
    "AdjustmentFileTTUM": (_date) => `AdjustmentFile/GenerateTTUM?startDate=${_date[0]}&endDate=${_date[1]}`,
    },
    ...reconUrls,
    ...serviceUrls,
    ...commentLogUrls,
}