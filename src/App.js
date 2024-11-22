import React, { useState } from 'react';
import axios from 'axios';


// Create an axios instance with the base URL for your API
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Use BACKEND_URL wherever you need the backend URL
const api = axios.create({
    baseURL: BACKEND_URL,
});

// Function to fetch synonyms for a given word
export const getSynonyms = async (word) => {
    try {
        const response = await api.get(`/synonym/${word}`);
        return response.data; // Return the list of synonyms
    } catch (error) {
        throw new Error(`Error fetching synonyms: ${error.message}`); // Throw an error if API fails
    }
};

const App = () => {
    const [word, setWord] = useState('');
    const [synonyms, setSynonyms] = useState('');
    const [result, setResult] = useState([]);
    const [error, setError] = useState(null);
    const [searchWord, setSearchWord] = useState(''); // Separate state for the search input

    // Add synonyms
    const handleAddWord = async (e) => {
        e.preventDefault();
        const newSynonyms = synonyms.split(',').map((s) => s.trim());

        if (!word || newSynonyms.length === 0) {
            setError('Please provide a word and its synonyms.');
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/synonym`, { word, synonyms: newSynonyms });
            alert('Word and synonyms added!');
            setWord('');
            setSynonyms('');
            setError(null); // Clear any previous error
        } catch (err) {
            setError('Failed to add synonyms.');
        }
    };

    // Search synonyms using the getSynonyms function
    const handleSearchWord = async () => {
        if (!searchWord) {
            setError('Please enter a word to search for synonyms.');
            return;
        }

        try {
            const synonymsList = await getSynonyms(searchWord); // Use the imported getSynonyms function
            setResult(synonymsList);
            setError(null); // Clear any previous error
        } catch (err) {
            setError('No synonyms found for this word.');
            setResult([]);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>Synonym Search Tool</h1>

            {/* Add word and synonyms form */}
            <form onSubmit={handleAddWord}>
                <div>
                    <label>Word:</label>
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Synonyms (comma-separated):</label>
                    <input
                        type="text"
                        value={synonyms}
                        onChange={(e) => setSynonyms(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white' }}>
                    Add Word
                </button>
            </form>

            {/* Search word form */}
            <div style={{ marginTop: '30px' }}>
                <h2>Search Synonyms</h2>
                <input
                    type="text"
                    value={searchWord} // Bind to searchWord state instead of word
                    onChange={(e) => setSearchWord(e.target.value)} // Update searchWord state
                    placeholder="Enter word to search"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <button
                    onClick={handleSearchWord}
                    style={{ padding: '8px 16px', backgroundColor: '#008CBA', color: 'white' }}
                >
                    Search
                </button>

                {/* Display errors */}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                {/* Display search results */}
                {result.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {result.map((synonym, index) => (
                            <li key={index} style={{ backgroundColor: '#f4f4f4', margin: '5px', padding: '8px' }}>
                                {synonym}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default App;
