const { createAssignment, randomLetters, date } = require('./course.test.js');
const { validate } = require('./assignment.js');

describe.each([[createAssignment()]])('Assignment validation', (assignment) => {

  test('Valid assignment is not invalid', async () => {
    expect((await validate(assignment)).isValid).toBeTruthy();
    expect((await validate(assignment)).reason).toBeUndefined();
  });

  describe('topic', () => {

    test('Without topic assignment is invalid', async () => {
      expect((await validate({ ...assignment, topic: null })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, topic: null })).reason).toEqual(
        'assignment_topic_missing'
      );
    });

    test('can not be too long', async () => {
      expect((await validate({ ...assignment, topic: randomLetters(100) })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, topic: randomLetters(100) })).reason).toEqual(
        'assignment_topic_too_long'
      );
    });

  });

  describe('course_id', () => {
    test('Without course_id assignment is not invalid', async () => {
      expect((await validate({ ...assignment, course_id: null })).isValid).toBeTruthy();
    });
  });

  describe('start_date', () => {

    test('Without start_date assignment is invalid', async () => {
      expect((await validate({ ...assignment, start_date: null })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, start_date: null })).reason).toEqual(
        'assignment_start_date_missing'
      );
    });

    test('Invalid date string causes invalidity', async () => {
      expect((await validate({ ...assignment, start_date: randomLetters(10) })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, start_date: randomLetters(10) })).reason).toEqual(
        'assignment_start_date_invalid_date'
      );
    });

    test('end_date before start_date causes invalidity', async () => {
      expect((await validate({ ...assignment, end_date: date(-1, new Date(assignment.start_date)) })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, end_date: date(-1, new Date(assignment.start_date)) })).reason).toEqual(
        'assignment_start_date_after_end_date'
      );
    });

  });

  describe('end_date', () => {
    test('Without end_date assignment is invalid', async () => {
      expect((await validate({ ...assignment, end_date: null })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, end_date: null })).reason).toEqual(
        'assignment_end_date_missing'
      );
    });

    test('Invalid date string causes invalidity', async () => {
      expect((await validate({ ...assignment, end_date: randomLetters(10) })).isValid).toBeFalsy();
      expect((await validate({ ...assignment, end_date: randomLetters(10) })).reason).toEqual(
        'assignment_end_date_invalid_date'
      );
    });

  });

});
