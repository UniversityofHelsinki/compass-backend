const messageKeys = require('../utils/message-keys');
const courseInFuture = (user_in_course, res) => {
    console.log('COURSE_IN_FUTURE', user_in_course?.message, user_in_course?.course_date);
    res.json([user_in_course]);
};
const courseEnded = (user_in_course, res) => {
    console.log('COURSE_ENDED', user_in_course?.message, user_in_course?.course_date);
    res.json([user_in_course]);
};
const courseOngoing = (user_in_course, res) => {
    console.log('COURSE_ONGOING', user_in_course?.message, user_in_course?.course_date);
    return true;
};
const courseState = [
    {
        evaluate: (course_state) => course_state === messageKeys.COURSE_IN_FUTURE,
        action: courseInFuture,
    },
    { evaluate: (course_state) => course_state === messageKeys.COURSE_ENDED, action: courseEnded },
    {
        evaluate: (course_state) => course_state === messageKeys.COURSE_ONGOING,
        action: courseOngoing,
    },
];
const processUserAndCourseState = (user_in_course, res) => {
    const userNotInCourse = user_in_course?.message === messageKeys.USER_NOT_IN_COURSE;
    if (userNotInCourse) {
        const strategy = courseState.find((s) => s.evaluate(user_in_course?.course_state));
        return strategy.action(user_in_course, res);
    } else {
        //do nothing
    }
};

const userAndCourseState = (user_in_course_and_course_state, res) => {
    return processUserAndCourseState(user_in_course_and_course_state, res);
};
module.exports.userAndCourseState = userAndCourseState;
