const dbHost = process.env.DB_HOST;

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
        console.error('Error fetching hello response:', error);
        throw error;
    }
};
