const apiUrl = process.env.REACT_APP_API_URL;

const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${apiUrl}/api/users/${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Errore nel recupero dei dati utente');
        }
    } catch (error) {
        console.error(`Errore nella richiesta ${endpoint}:`, error);
        throw error;
    }
};

export default fetchData;
