import axios from 'axios';

const API_URL = 'http://MindBalancer-1357167474.us-east-1.elb.amazonaws.com/scores';

export const getScores = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};