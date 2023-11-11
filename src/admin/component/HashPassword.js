const bcrypt = require('bcryptjs');

const hashValue = async (plainpassword) => {
    const hashValue = await bcrypt.hash(plainpassword, 10);
    return hashValue;
}

const compareHashValue = async (plainpassword, encryptedPass) => {
    const isMatched = await bcrypt.compare(plainpassword, encryptedPass);
    return isMatched;
}

export { hashValue, compareHashValue };