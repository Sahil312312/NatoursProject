//Yaha pr humne Error in-built node.js class ko inherit kiya h
class AppError extends Error {
    constructor(message,statusCode){
        super(message); //to access constructor of parent class
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(`4`) ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor)
    }
} 

module.exports = AppError