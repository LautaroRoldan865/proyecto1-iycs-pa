import axios from "axios";
import axiosConfig from "../../../../utils/axiosConfig";
import { SelectSuperlineaInterface, Superlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";


const apiUrl = axiosConfig.apiUrl;

const SuperLineaService = {
        obtenerParaSelect: async (): Promise<SelectSuperlineaInterface[]> => {
            try {
            const token = localStorage.getItem("Token");

            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {};

            const { data } = await axios.get<SelectSuperlineaInterface[]>(
                `${apiUrl}/superlinea/for-select`,
                { headers }
            );

            return data;
            } catch (error) {
            console.error("Error al obtener las super líneas:", error);
            throw error;
            }
        },
};

export default SuperLineaService;