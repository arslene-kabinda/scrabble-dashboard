import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../services/axios";
import { getTransactions } from "../services/transactions";

export const useTransactions = create((set, get) => ({
    transactions: [],
    loadTransactions: async () => {
        set({ loading: true })
        try {
            const transactions = await getTransactions()
            set({ transactions })
        } catch (e) {
            console.log(e)
        } finally {
            set({ loading: false })
        }
    },
    loading: false
}))
