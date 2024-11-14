import axios from 'axios';

import Cookies from 'js-cookie';
import { SERVER_URL } from 'constants/URLs';

const API_URL = `${SERVER_URL}/generative-ai/project-description`;
// TODO: Update to the actual cloud server IP address when deploying

/**
 * Cleans up text by removing duplicated or incorrectly formatted parts
 * @param {string} aiGeneratedText - The text to clean and process
 * @returns {string} - Cleaned and processed text
 */
const cleanUpText = (aiGeneratedText) => {
    return aiGeneratedText
        .replace(/\\n/g, '\n') // Replace escaped newlines with actual newlines
        .replace(/\\"/g, '"') // Convert escaped double quotes
        .replace(/\\'/g, "'") // Convert escaped single quotes
        .replace(/\d+\.\s+/g, '') // Remove leading numbers like "1. ", "2. "
        .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
        .replace(/(문구:.*?\n설명:.*?\n)+/g, '$1') // Deduplicate repeated marketing phrases
        .trim(); // Remove leading and trailing whitespaces
};

/**
 * Logs AI filter datay
 * @param {Array} aiFilterData - List of filter data from API response
 */
const logAiFilterData = (aiFilterData) => {
    if (!Array.isArray(aiFilterData)) {
        console.error('Invalid filter data format.');
        return;
    }

    aiFilterData.forEach((filter) => {
        console.log(
            `Filter - Group: ${filter.groupName}, Name: ${filter.name}, Score: ${filter.score}, Result: ${filter.result}`
        );
    });
};

/**
 * Fetches AI-generated project description
 * @param {string} title - Project title
 * @param {string} description - Project description
 * @param {Array} tags - Tags related to the project
 * @param {string} category - Project category
 * @returns {Promise<string>} - Processed project description
 * @throws {Error} - Throws if API request fails
 */
export const fetchAiGeneratedDescriptionDetail = async (title = '', description = '', tags = [], category = '') => {
    try {
        const payload = { title, description, tags, category };

        // Log request data
        console.log(
            `Request Data - Title: ${payload.title}, Description: ${payload.description}, Tags: ${payload.tags.join(', ')}, Category: ${payload.category}`
        );

        const { data, status } = await axios.post(API_URL, payload, {
            headers: {
                ...(Cookies.get('accessToken') && {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                }),
            },
        });

        // Log status and full_message from response

        logAiFilterData(data.ai_filter_data); // Log AI filter data

        return cleanUpText(data.full_message) || 'No description available.';
    } catch (error) {
        console.error('Error generating project description:', error.message || error);

        if (error.response) {
            console.error(`Error Status: ${error.response.status}`);
            console.error(`Error Data: ${JSON.stringify(error.response.data)}`);
        }

        throw new Error('Failed to generate project description. Please try again.');
    }
};

export default fetchAiGeneratedDescriptionDetail;
