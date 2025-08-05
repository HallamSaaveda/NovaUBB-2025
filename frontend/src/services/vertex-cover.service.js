import axiosInstance from './root.service.js';

export const vertexCoverService = {
    async calcularVertexCover(data) {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.post('/vertex-cover', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 