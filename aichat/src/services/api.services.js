// services/api.service.js

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiService {
	static async get(endpoint) {
		try {
			const response = await fetch(`${API_BASE_URL}${endpoint}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API Get Error:", error);
			throw error;
		}
	}

	static async hello() {
		try {
			return await this.get("/hello");
		} catch (error) {
			console.error("Hello Service Error:", error);
			throw error;
		}
	}
}

export default ApiService;
