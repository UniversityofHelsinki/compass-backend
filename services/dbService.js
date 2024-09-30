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
}
exports.connectusertocourse  = async (req, res) => {
    const url = `${dbHost}/api/connectusertocourse`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
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

exports.addcourse  = async (req, res) => {
    const url = `${dbHost}/api/addcourse`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
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

exports.adduser  = async (req, res) => {
    const url = `${dbHost}/api/adduser`;
    try {
        // Wait for the fetch operation to complete
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.user)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Handle any errors that may occur during the fetch
        console.error('Error fetching adduser response:', error);
        throw error;
    }
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
}


