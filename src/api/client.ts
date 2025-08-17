import { useAxiosAuth } from "../hooks/useAxiosAuth";
import { IUser } from "../types/types";

const api = useAxiosAuth()

export const getClients = () => api.get("/clients")
export const createClient = (clientData: IUser) => api.post("/clients", clientData)