/**
 * Generates a random alphanumeric string of specified length
 * @param {number} length - The length of the string to generate
 * @returns {string} Random alphanumeric string
 */
export function generateRandomAlphanumeric(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
} 