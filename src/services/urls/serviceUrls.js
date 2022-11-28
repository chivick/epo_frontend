export const serviceUrls = {
    getServiceLogTypes: "Admin/GetServiceLogTypes",
    filterServiceLogs: (type, startDate,EndDate) =>  `Admin/FilterServiceLog?_type=${type}&startDate=${startDate}&endDate=${EndDate}`,
}