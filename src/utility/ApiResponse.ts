class ApiResponse {
    statusCode : number;
    message : string;
    data : object;
    constructor(statusCode : number, message : string, data : object) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}


export default ApiResponse;