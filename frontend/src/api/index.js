export const logFormSubmission = async (email, page) => {
    try {
        const response = await fetch('/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, page }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to log submission');
        }

        return await response.json();
    } catch (error) {
        console.error('Error logging form submission:', error);
        throw error;
    }
};