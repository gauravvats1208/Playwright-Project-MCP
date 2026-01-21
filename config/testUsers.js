/**
 * SauceDemo Test Users Configuration
 * Centralized credential management for all test scenarios
 */

const TEST_USERS = {
    standard_user: {
        username: 'standard_user',
        password: 'secret_sauce',
        type: 'normal',
        description: 'Standard user with full functionality',
        expectedBehavior: 'successful login'
    },
    problem_user: {
        username: 'problem_user',
        password: 'secret_sauce',
        type: 'problematic',
        description: 'User that encounters UI issues (broken images)',
        expectedBehavior: 'UI issues detected'
    },
    performance_glitch_user: {
        username: 'performance_glitch_user',
        password: 'secret_sauce',
        type: 'slow',
        description: 'User that experiences performance delays',
        expectedBehavior: 'slow but functional'
    },
    locked_out_user: {
        username: 'locked_out_user',
        password: 'secret_sauce',
        type: 'locked',
        description: 'User that is locked out of the system',
        expectedBehavior: 'locked out error'
    },
    error_user: {
        username: 'error_user',
        password: 'secret_sauce',
        type: 'error',
        description: 'User that encounters various errors',
        expectedBehavior: 'error scenarios'
    },
    visual_user: {
        username: 'visual_user',
        password: 'secret_sauce',
        type: 'visual',
        description: 'User for visual regression testing',
        expectedBehavior: 'visual differences'
    }
};

// Common password for all SauceDemo users
const COMMON_PASSWORD = 'secret_sauce';

// Helper functions
const getUserCredentials = (username) => {
    const user = TEST_USERS[username];
    if (!user) {
        throw new Error(`User '${username}' not found in test configuration`);
    }
    return {
        username: user.username,
        password: user.password
    };
};

const getAllUsers = () => {
    return Object.values(TEST_USERS);
};

const getUserTypes = () => {
    return Object.keys(TEST_USERS);
};

const getRandomUser = (excludeType = null) => {
    const users = Object.values(TEST_USERS).filter(user => user.type !== excludeType);
    return users[Math.floor(Math.random() * users.length)];
};

module.exports = {
    TEST_USERS,
    COMMON_PASSWORD,
    getUserCredentials,
    getAllUsers,
    getUserTypes,
    getRandomUser
};