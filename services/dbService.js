const dbHost = process.env.DB_HOST;
const { logger } = require('../logger');

const dbClient = async (path, options = { method: 'GET' }) => {
    try {
        const url = `${dbHost}${path.indexOf('/') !== 0 ? `/${path}` : path}`;
        console.log(`Calling ${url}`);
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Unexpected status code ${response.status} from ${url}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

exports.dbClient = dbClient;

exports.getHelloFromBackend = async () => {
    const url = `/api/hello`;
    return await dbClient(url);
};

exports.saveAnswer = async (req, res) => {
    const url = `/api/student/saveAnswer`;
    return await dbClient(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
};

exports.isuserincourse = async (course_id, user_id) => {
    const url = `${dbHost}/api/isuserincourse/${course_id}/${user_id}`;
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
        console.error('Error fetching isuserincourse response:', error);
        throw error;
    }
};
exports.connectusertocourse = async (req, res) => {
    const url = `${dbHost}/api/connectusertocourse`;
    try {
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
        console.error('Error fetching connectusertocourse response:', error);
        throw error;
    }
};

exports.addcourse = async (req, res) => {
    const url = `${dbHost}/api/addcourse`;
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
        console.error('Error fetching addcourse response:', error);
        throw error;
    }
};

exports.addUser = async (user) => {
    const url = `/api/addUser`;
    return await dbClient(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

exports.userExist = async (user_id) => {
    const url = `${dbHost}/api/userExist/${user_id}`;
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
        console.error('Error fetching userExist response:', error);
        throw error;
    }
};

exports.deleteStudentAnswer = async (req, res) => {
    const url = `/api/student/deleteStudentAnswer`;
    return await dbClient(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });
};
