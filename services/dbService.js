const dbHost = process.env.DB_HOST;
const { logger } = require('../logger');

exports.getHelloFromBackend = async () => {
    const url = `${dbHost}/api/hello`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching hello response:', error);
        throw error;
    }
};

exports.saveAnswer = async (req, res) => {
    const url = `${dbHost}/api/saveanswer`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching saveAnswer response:', error);
        throw error;
    }
};

exports.isstudentincourse = async (course_id, student_id) => {
    const url = `${dbHost}/api/isstudentincourse/${course_id}/${student_id}`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching isstudentincourse response:', error);
        throw error;
    }
}

exports.addstudenttocourse  = async (course_id, user_id) => {
    const url = `${dbHost}/api/addstudenttocourse`;
    try {
        // Wait for the fetch operation to complete
        const course = {"course_id": course_id};
        const user = {"user_id": user_id};
        const course_user = {...course, ...user};
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course_user)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching addstudenttocourse response:', error);
        throw error;
    }
};

exports.addstudent  = async (req, res) => {
    const url = `${dbHost}/api/addstudent`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: req.user.eppn})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching addstudent response:', error);
        throw error;
    }
};

exports.studentExist = async (student_id) => {
    const url = `${dbHost}/api/studentExist/${student_id}`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching studentExist response:', error);
        throw error;
    }
}

exports.getUserAnswersForCourseId = async (course_id, user_name) => {
    const url = `${dbHost}/api/getUserAnswersForCourseId/${course_id}/${user_name}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user answers for course:', error);
        throw error;
    }
}


