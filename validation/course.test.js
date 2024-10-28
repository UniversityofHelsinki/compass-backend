const { validate } = require('./course.js');

const dbService = require('../services/dbService.js');

jest.mock('../services/dbService.js');


const randomLetters = (count) => { 
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < count; i++) {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    result += randomLetter;
  }
  return result;
};

module.exports.randomLetters = randomLetters;

const date = (dayOffset = 0, date = new Date()) => {
  const day = 24 * 60 * 60 * 1000;
  const today = date.getTime();
  return new Date(today + (dayOffset * day)).toISOString();
};

module.exports.date = date;

const createAssignment = (course, overrides = {}) => ({
  id: parseInt(Math.random() * 100),
  course_id: course,
  topic: randomLetters(10),
  start_date: date(-30),
  end_date: date(30),
  created: date(-35)
});

module.exports.createAssignment = createAssignment;


const createAssignments = (course, count) => {
  return [ ...Array(count) ].map(() => createAssignment(course));
};

const createCourse = (overrides = {}) => {
  const course_id = randomLetters(10);
  return {
    id: parseInt(Math.random() * 100),
    course_id,
    title: randomLetters(10),
    description: randomLetters(200),
    start_date: date(-30),
    end_date: date(30),
    assignments: createAssignments(course_id, Math.floor(Math.random() * 24)),
    ...overrides
  };
};

describe.each([[createCourse()]])('Course validation', (course) => {

  beforeAll(() => {
    dbService.dbClient.mockImplementation(async (path) => {
      return null;
    });
  });

  test('Valid course is not invalid', async () => {
    expect((await validate(course)).isValid).toBeTruthy();
    expect((await validate(course)).reason).toBeUndefined();
  });

  describe('title', () => {

    test('Without title course is invalid', async () => {
      expect((await validate({ ...course, title: null })).isValid).toBeFalsy();
      expect((await validate({ ...course, title: null })).reason).toEqual(
        'course_title_missing'
      );
    });

    test('Too long title causes invalidity', async () => {
      expect((await validate({ ...course, title: randomLetters(100) })).isValid).toBeFalsy();
      expect((await validate({ ...course, title: randomLetters(100) })).reason).toEqual(
        'course_title_too_long'
      );
    });

  });

  describe('course_id', () => {

    test('Nonexistence of course_id causes invalidity', async () => {
      expect((await validate({ ...course, course_id: null })).isValid).toBeFalsy();
      expect((await validate({ ...course, course_id: null })).reason).toEqual(
        'course_course_id_missing'
      );
    });

    test('Too long course_id causes invalidity', async () => {
      expect((await validate({ ...course, course_id: randomLetters(200) })).isValid).toBeFalsy();
      expect((await validate({ ...course, course_id: randomLetters(200) })).reason).toEqual(
        'course_course_id_too_long'
      );
    });

    test('When course_id is not in use course is not invalid', async () => {
      expect((await validate(course)).isValid).toBeTruthy();
      expect((await validate(course)).reason).toBeUndefined();
    });

    test('When course_id is used by the same course, course is not invalid', async () => {
      dbService.dbClient.mockImplementationOnce(async (path) => {
        if (path === `/api/teacher/courses/course_id/${course.course_id}`) {
          return { id: course.id, course_id: course.course_id };
        }
      });

      const validation = await validate(course);
      expect(validation.isValid).toBeTruthy();
      expect(validation.reason).toBeUndefined();
    });

    test('When course_id is used by different course, course is invalid', async () => {
      dbService.dbClient.mockImplementationOnce(async (path) => {
        if (path === `/api/teacher/courses/course_id/${course.course_id}`) {
          return { id: course.id + 1, course_id: course.course_id };
        }
        return null;
      });

      const validation = await validate(course);
      expect(validation.isValid).toBeFalsy();
      expect(validation.reason).toEqual(
        'course_course_id_already_in_use'
      );
    });

  });

  describe('start_date', () => {
    test('Without start_date course is invalid', async () => {
      expect((await validate({ ...course, start_date: null })).isValid).toBeFalsy();
      expect((await validate({ ...course, start_date: null })).reason).toEqual(
        'course_start_date_missing'
      );
    });

    test('comes after end_date causes invalidity', async () => {
      expect((await validate({ ...course, start_date: date(1, new Date(course.end_date) )})).isValid).toBeFalsy();
      expect((await validate({ ...course, start_date: date(1, new Date(course.end_date) )})).reason).toEqual(
        'course_start_date_after_end_date'
      );
    });

    test('invalid date string causes invalidity', async () => {
      expect((await validate({ ...course, start_date: randomLetters(10) })).isValid).toBeFalsy();
      expect((await validate({ ...course, start_date: randomLetters(10) })).reason).toEqual(
        'course_start_date_invalid_date'
      );
    });

  });

  describe('end_date', () => {

    test('Nonexistence of end_date causes invalidity', async () => {
      expect((await validate({ ...course, end_date: null })).isValid).toBeFalsy();
      expect((await validate({ ...course, end_date: null })).reason).toEqual(
        'course_end_date_missing'
      );
    });

    test('Invalid date string causes invalidity', async () => {
      expect((await validate({ ...course, end_date: randomLetters(10) })).isValid).toBeFalsy();
      expect((await validate({ ...course, end_date: randomLetters(10) })).reason).toEqual(
        'course_end_date_invalid_date'
      );
    });

  });

});

