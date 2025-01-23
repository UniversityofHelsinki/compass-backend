const { validateProperties } = require('./validation.js');

const topic = (topic) => {
    if (!topic) {
        return 'teacher_form_title_can_not_be_empty';
    } else if (topic.length > 50) {
        return 'teacher_form_course_id_too_long';
    }
};

const start_date = (start_date) => {
    if (!start_date) {
        return 'teacher_form_assignment_start_date_can_not_be_empty';
    } else if (new Date(start_date) == 'Invalid Date') {
        return 'assignment_start_date_invalid_date';
    }
};

const end_date = (end_date) => {
    if (!end_date) {
        return 'teacher_form_assignment_end_date_can_not_be_empty';
    } else if (new Date(end_date) == 'Invalid Date') {
        return 'assignment_end_date_invalid_date';
    }
};

const validations = {
    topic,
    start_date,
    end_date,
};

const validate = async (assignment) => {
    const propertyValidationResults = await validateProperties(validations, assignment);

    if (propertyValidationResults) {
        return propertyValidationResults;
    }

    if (new Date(assignment.start_date) > new Date(assignment.end_date)) {
        return {
            isValid: false,
            reason: 'teacher_form_assignment_start_date_after_end_date',
        };
    }

    return {
        isValid: true,
    };
};

module.exports = {
    validate,
};
