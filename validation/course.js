const { validateProperties } = require('./validation.js');
const { dbClient } = require('../services/dbService.js');

const title = (title) => {
    if (!title) {
        return 'course_title_missing';
    } else if (title.length > 50) {
        return 'course_title_too_long';
    }
};

const course_id = async (course_id, course) => {
    const alreadyInUse = async () => {
        const existingCourse = await dbClient(`/api/teacher/courses/course_id/${course_id}`);
        if (!existingCourse || parseInt(course.id) === existingCourse.id) {
            return false;
        }

        if (course.id && existingCourse.id !== course.id) {
            return true;
        }

        if (!course.id && existingCourse.id) {
            return true;
        }
    };

    if (!course_id) {
        return 'course_course_id_missing';
    } else if (course_id.length > 20) {
        return 'course_course_id_too_long';
    } else if (await alreadyInUse()) {
        return 'course_course_id_already_in_use';
    }
};

const start_date = (start_date) => {
    if (!start_date) {
        return 'course_start_date_missing';
    } else if (new Date(start_date) == 'Invalid Date') {
        return 'course_start_date_invalid_date';
    }
};

const end_date = (end_date) => {
    if (!end_date) {
        return 'course_end_date_missing';
    } else if (new Date(end_date) == 'Invalid Date') {
        return 'course_end_date_invalid_date';
    }
};

const validations = {
    title,
    course_id,
    start_date,
    end_date,
};

const validate = async (course) => {
    const propertyValidationResults = await validateProperties(validations, course);

    if (propertyValidationResults) {
        return propertyValidationResults;
    }

    if (new Date(course.start_date) > new Date(course.end_date)) {
        return {
            isValid: false,
            reason: 'course_start_date_after_end_date',
        };
    }

    return {
        isValid: true,
    };
};

const validateNewCourse = async (course) => {
    const validation = await validate(course);
    if (!validation.isValid) {
        return validation;
    }

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    if (new Date(course.start_date) < today) {
        return {
            isValid: false,
            reason: 'course_start_date_in_the_past',
        };
    }

    return {
        isValid: true,
    };
};

const validateExistingCourse = async (course, existingCourse) => {
    if (!existingCourse || !existingCourse.id) {
        return {
            isValid: false,
            reason: 'course_existing_course_not_found',
        };
    } else if (existingCourse.user_name !== course.user_name) {
        return {
            isValid: false,
            reason: 'course_existing_course_different_teacher',
        };
    } else if (course.course_id !== existingCourse.course_id) {
        return {
            isValid: false,
            reason: 'course_existing_course_has_different_course_id',
        };
    }

    const validation = await validate(course);
    if (!validation.isValid) {
        return validation;
    }

    const modifiedAssignments = course.assignments;
    const existingAssignments = existingCourse.assignments;

    const isOnGoingAssignment = (assignment) => {
        const today = new Date();
        return new Date(assignment.start_date) < today && new Date(assignment.end_date) > today;
    };

    const isPastAssignment = (assignment) => {
        const today = new Date();
        return new Date(assignment.end_date) < today;
    };

    const onGoingAssignments = existingAssignments.filter(isOnGoingAssignment);

    const modifiedAssignmentIds = modifiedAssignments.map((ma) => ma.id);
    for (const onGoingAssignment of onGoingAssignments) {
        if (!modifiedAssignmentIds.includes(onGoingAssignment.id)) {
            return {
                isValid: false,
                reason: 'course_assignment_on_going_assignment_can_not_be_deleted',
            };
        }
    }

    for (const onGoingAssignment of onGoingAssignments) {
        for (const modifiedAssignment of modifiedAssignments) {
            if (
                onGoingAssignment.id === modifiedAssignment.id &&
                onGoingAssignment.topic !== modifiedAssignment.topic
            ) {
                return {
                    isValid: false,
                    reason: 'course_assignment_on_going_assignment_topic_can_not_be_changed',
                };
            }
        }
    }

    for (const onGoingAssignment of onGoingAssignments) {
        for (const modifiedAssignment of modifiedAssignments) {
            if (
                onGoingAssignment.id === modifiedAssignment.id &&
                (new Date(modifiedAssignment.end_date) < new Date(onGoingAssignment.end_date) ||
                    new Date(modifiedAssignment.start_date) >
                        new Date(onGoingAssignment.start_date))
            ) {
                return {
                    isValid: false,
                    reason: 'course_assignment_on_going_assignment_can_not_be_shortened',
                };
            }
        }
    }

    const pastAssignments = existingAssignments.filter(isPastAssignment);
    for (const pastAssignment of pastAssignments) {
        if (!modifiedAssignmentIds.includes(pastAssignment.id)) {
            return {
                isValid: false,
                reason: `course_assignment_past_assignment_can_not_be_deleted`,
            };
        }
        for (const modifiedAssignment of modifiedAssignments) {
            if (pastAssignment.id === modifiedAssignment.id) {
                if (
                    pastAssignment.topic !== modifiedAssignment.topic ||
                    pastAssignment.start_date !== modifiedAssignment.start_date ||
                    pastAssignment.end_date !== modifiedAssignment.end_date
                ) {
                    return {
                        isValid: false,
                        reason: 'course_assignment_past_assignment_can_not_be_changed',
                    };
                }
            }
        }
    }

    return {
        isValid: true,
    };
};

const validateDeletableCourse = async (course, user) => {
    if (course.user_name !== user.eppn) {
        return {
            isValid: false,
            reason: 'course_different_teacher',
        };
    }

    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes(0);
    now.setHours(0);
    const isOnGoingAssignment = (assignment) =>
        new Date(assignment.start_date) <= now && new Date(assignment.end_date) >= now;
    const onGoingAssignments = course.assignments.filter(isOnGoingAssignment);
    if (onGoingAssignments.length > 0) {
        return {
            isValid: false,
            reason: 'course_can_not_have_on_going_assignments',
        };
    }

    return {
        isValid: true,
    };
};

module.exports = {
    validate,
    validateExistingCourse,
    validateNewCourse,
    validateDeletableCourse,
};
