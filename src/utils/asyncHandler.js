/*
Using asyncHandler wrapper function ensures that all errors, whether synchronous or asynchronous returned by the async functions, are handled consistently and passed to Express.js’s error-handling middleware. This leads to cleaner, more maintainable code and leverages Express.js’s built-in error handling mechanisms effectively.
*/

//Try catch method

const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
export default asyncHandler

//Higher order async function 

// const asyncHandler =() => {} Normal function
// const asyncHandler = (func) => { ()=>{} } Higher order function basically function taking dunction as param
// const asynchHandler = (fn) => async () => {} async Higher order function


//Promises method

// const asyncHandler =(requestHandler)=>{
//     return (req, res, next)=>{
//         Promise.resolve(requestHandler(req, res, next))
//         .catch((err) => next(err))
//     }
// }

// export default asyncHandler