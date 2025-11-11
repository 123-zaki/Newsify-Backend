// const asyncHandler = function (asyncFunction) {
//     return async (req, res, next) => {
//         try {
//             await asyncFunction(req, res, next);
//         } catch (error) {
//             next(err);
//         }
//     };
// };

const asyncHandler = function (asyncFunction) {
  return (req, res, next) => {
    Promise.resolve(asyncFunction(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
