import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getAllProducts() {
    try {
        const response = await api.get("/products/getAllProducts");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}