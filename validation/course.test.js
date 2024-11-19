const {
    validate,
    validateExistingCourse,
    validateNewCourse,
    validateDeletableCourse,
} = require('./course.js');

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
    return new Date(today + dayOffset * day).toISOString();
};

module.exports.date = date;

const createAssignment = (course, overrides = {}) => ({
    id: parseInt(Math.random() * 100),
    course_id: course,
    topic: randomLetters(10),
    start_date: date(-30),
    end_date: date(30),
    created: date(-35),
    ...overrides,
});

module.exports.createAssignment = createAssignment;

const createAssignments = (course, count) => {
    return [...Array(count)].map(() => createAssignment(course));
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
        assignments: createAssignments(
            overrides.course_id || course_id,
            Math.floor(Math.random() * 24),
        ),
        ...overrides,
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
                'course_title_missing',
            );
        });

        test('Too long title causes invalidity', async () => {
            expect((await validate({ ...course, title: randomLetters(100) })).isValid).toBeFalsy();
            expect((await validate({ ...course, title: randomLetters(100) })).reason).toEqual(
                'course_title_too_long',
            );
        });
    });

    describe('course_id', () => {
        test('Nonexistence of course_id causes invalidity', async () => {
            expect((await validate({ ...course, course_id: null })).isValid).toBeFalsy();
            expect((await validate({ ...course, course_id: null })).reason).toEqual(
                'course_course_id_missing',
            );
        });

        test('Too long course_id causes invalidity', async () => {
            expect(
                (await validate({ ...course, course_id: randomLetters(200) })).isValid,
            ).toBeFalsy();
            expect((await validate({ ...course, course_id: randomLetters(200) })).reason).toEqual(
                'course_course_id_too_long',
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
            expect(validation.reason).toEqual('course_course_id_already_in_use');
        });
    });

    describe('start_date', () => {
        test('Without start_date course is invalid', async () => {
            expect((await validate({ ...course, start_date: null })).isValid).toBeFalsy();
            expect((await validate({ ...course, start_date: null })).reason).toEqual(
                'course_start_date_missing',
            );
        });

        test('comes after end_date causes invalidity', async () => {
            expect(
                (await validate({ ...course, start_date: date(1, new Date(course.end_date)) }))
                    .isValid,
            ).toBeFalsy();
            expect(
                (await validate({ ...course, start_date: date(1, new Date(course.end_date)) }))
                    .reason,
            ).toEqual('course_start_date_after_end_date');
        });

        test('invalid date string causes invalidity', async () => {
            expect(
                (await validate({ ...course, start_date: randomLetters(10) })).isValid,
            ).toBeFalsy();
            expect((await validate({ ...course, start_date: randomLetters(10) })).reason).toEqual(
                'course_start_date_invalid_date',
            );
        });

        test('start date can not be in the past with new courses', async () => {
            expect(
                (await validateNewCourse({ ...course, start_date: date(-1, new Date()) })).isValid,
            ).toBeFalsy();
            expect(
                (await validateNewCourse({ ...course, start_date: date(-1, new Date()) })).reason,
            ).toEqual('course_start_date_in_the_past');
        });
    });

    describe('end_date', () => {
        test('Nonexistence of end_date causes invalidity', async () => {
            expect((await validate({ ...course, end_date: null })).isValid).toBeFalsy();
            expect((await validate({ ...course, end_date: null })).reason).toEqual(
                'course_end_date_missing',
            );
        });

        test('Invalid date string causes invalidity', async () => {
            expect(
                (await validate({ ...course, end_date: randomLetters(10) })).isValid,
            ).toBeFalsy();
            expect((await validate({ ...course, end_date: randomLetters(10) })).reason).toEqual(
                'course_end_date_invalid_date',
            );
        });
    });

    test('Teacher can only delete his own courses', async () => {
        const differentTeacher = { ...course, user_name: randomLetters(10) };
        expect((await validateExistingCourse(course, differentTeacher)).isValid).toBeFalsy();
        expect((await validateExistingCourse(course, differentTeacher)).reason).toEqual(
            'course_existing_course_different_teacher',
        );
    }),
        describe('assignment restrictions', () => {
            describe('on going assignment', () => {
                test('can not be deleted', async () => {
                    const onGoingAssignments = [
                        createAssignment(course.id),
                        createAssignment(course.id),
                    ];

                    const existingCourse = { ...course, assignments: [...onGoingAssignments] };

                    const modifiedCourse = { ...existingCourse, assignments: [] };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);

                    expect(validation.isValid).toBeFalsy();
                    expect(validation.reason).toEqual(
                        `course_assignment_on_going_assignment_can_not_be_deleted`,
                    );
                });

                test('topic can not be changed', async () => {
                    const onGoingAssignments = [
                        createAssignment(course.id),
                        createAssignment(course.id),
                    ];

                    const existingCourse = { ...course, assignments: [...onGoingAssignments] };
                    const modifiedCourse = { ...course, assignments: [...onGoingAssignments] };
                    modifiedCourse.assignments[0] = {
                        ...onGoingAssignments[0],
                        topic: onGoingAssignments[0].topic + randomLetters(10),
                    };
                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);

                    expect(validation.isValid).toBeFalsy();
                    expect(validation.reason).toEqual(
                        `course_assignment_on_going_assignment_topic_can_not_be_changed`,
                    );
                });

                test('can be extended', async () => {
                    const onGoingAssignments = [createAssignment(course.id)];

                    const existingCourse = { ...course, assignments: [...onGoingAssignments] };
                    const modifiedCourse = { ...course, assignments: [...onGoingAssignments] };
                    const endDate =
                        new Date(onGoingAssignments[0].end_date).getTime() + 24 * 60 * 60 * 1000;
                    modifiedCourse.assignments[0] = {
                        ...onGoingAssignments[0],
                        end_date: new Date(endDate).toISOString(),
                    };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeTruthy();
                });

                test('can not be shortened with end date', async () => {
                    const onGoingAssignments = [createAssignment(course.id)];

                    const existingCourse = { ...course, assignments: [...onGoingAssignments] };
                    const modifiedCourse = { ...course, assignments: [...onGoingAssignments] };
                    const endDate =
                        new Date(onGoingAssignments[0].end_date).getTime() - 24 * 60 * 60 * 1000;
                    modifiedCourse.assignments[0] = {
                        ...onGoingAssignments[0],
                        end_date: new Date(endDate).toISOString(),
                    };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeFalsy();
                    expect(validation.reason).toEqual(
                        `course_assignment_on_going_assignment_can_not_be_shortened`,
                    );
                });

                test('can not be shortened with start date', async () => {
                    const onGoingAssignments = [createAssignment(course.id)];

                    const existingCourse = { ...course, assignments: [...onGoingAssignments] };
                    const modifiedCourse = { ...course, assignments: [...onGoingAssignments] };
                    const startDate =
                        new Date(onGoingAssignments[0].start_date).getTime() + 24 * 60 * 60 * 1000;
                    modifiedCourse.assignments[0] = {
                        ...onGoingAssignments[0],
                        start_date: new Date(startDate).toISOString(),
                    };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeFalsy();
                    expect(validation.reason).toEqual(
                        `course_assignment_on_going_assignment_can_not_be_shortened`,
                    );
                });
            });

            describe('past assignment', () => {
                test('can not be changed', async () => {
                    const pastAssignments = [
                        createAssignment(course.id, {
                            start_date: date(-30),
                            end_date: date(-1),
                        }),
                    ];

                    const existingCourse = { ...course, assignments: [...pastAssignments] };
                    const modifiedCourse = { ...course, assignments: [...pastAssignments] };

                    modifiedCourse.assignments[0] = {
                        ...pastAssignments[0],
                        topic: pastAssignments[0].topic + randomLetters(10),
                    };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeFalsy();
                    expect(validation.reason).toEqual(
                        `course_assignment_past_assignment_can_not_be_changed`,
                    );
                });

                test('can not be deleted', async () => {
                    const pastAssignments = [
                        createAssignment(course.id, {
                            start_date: date(-30),
                            end_date: date(-1),
                        }),
                    ];

                    const existingCourse = { ...course, assignments: [...pastAssignments] };
                    const modifiedCourse = { ...existingCourse, assignments: [...pastAssignments] };
                    modifiedCourse.assignments.splice(0, 1);

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeFalsy();
                    expect(validation.reason).toEqual(
                        `course_assignment_past_assignment_can_not_be_deleted`,
                    );
                });
            });

            describe('future assignment', () => {
                test('can be changed', async () => {
                    const futureAssignments = [
                        createAssignment(course.id, {
                            start_date: date(1),
                            end_date: date(30),
                        }),
                    ];

                    const existingCourse = { ...course, assignments: [...futureAssignments] };
                    const modifiedCourse = { ...course, assignments: [...futureAssignments] };

                    modifiedCourse.assignments[0] = {
                        ...futureAssignments[0],
                        topic: futureAssignments[0].topic + randomLetters(10),
                        start_date: date(20),
                        end_date: date(60),
                    };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeTruthy();
                });

                test('can be deleted', async () => {
                    const futureAssignments = [
                        createAssignment(course.id, {
                            start_date: date(1),
                            end_date: date(30),
                        }),
                    ];

                    const existingCourse = { ...course, assignments: [...futureAssignments] };
                    const modifiedCourse = { ...course, assignments: [] };

                    const validation = await validateExistingCourse(modifiedCourse, existingCourse);
                    expect(validation.isValid).toBeTruthy();
                });
            });
        });

    describe('course deletion', () => {
        test('course can not have on going assignments', async () => {
            const onGoingAssignments = [
                createAssignment(course.id, {
                    start_date: date(-30),
                    end_date: date(30),
                }),
            ];

            const user = { eppn: randomLetters(10) };
            const deletableCourse = {
                ...course,
                assignments: [...onGoingAssignments],
                user_name: user.eppn,
            };
            const validation = await validateDeletableCourse(deletableCourse, user);
            expect(validation.isValid).toBeFalsy();
            expect(validation.reason).toEqual(`course_can_not_have_on_going_assignments`);
        });

        test('having past or future assignments is ok', async () => {
            const assignments = [
                createAssignment(course.id, {
                    start_date: date(-30),
                    end_date: date(-1),
                }),
                createAssignment(course.id, {
                    start_date: date(1),
                    end_date: date(30),
                }),
            ];

            const user = { eppn: randomLetters(10) };
            const deletableCourse = { ...course, assignments, user_name: user.eppn };
            const validation = await validateDeletableCourse(deletableCourse, user);
            expect(validation.isValid).toBeTruthy();
        });

        test('deleting teacher must own the course', async () => {
            const user = { eppn: randomLetters(10) };
            const deletableCourse = { ...course, user_name: user.eppn };
            const validation = await validateDeletableCourse(deletableCourse, {
                eppn: randomLetters(8),
            });
            expect(validation.isValid).toBeFalsy();
            expect(validation.reason).toEqual(`course_different_teacher`);
        });
    });
});
