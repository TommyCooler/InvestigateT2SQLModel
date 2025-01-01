import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getAllLaptops() {
    try {
        const response = await api.get("/laptops");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}