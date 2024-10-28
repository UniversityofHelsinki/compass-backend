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

  }

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
  end_date
};

const validate = async (course) => {

  const propertyValidationResults = await validateProperties(validations, course);

  if (propertyValidationResults) {
    return propertyValidationResults;
  }

  if (new Date(course.start_date) > new Date(course.end_date)) {
    return {
      isValid: false,
      reason: 'course_start_date_after_end_date'
    };
  }

  return {
    isValid: true
  };

};

module.exports = {
  validate
};
