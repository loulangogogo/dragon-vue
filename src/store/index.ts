import {defineStore} from 'pinia'
import state from "./state";
import getters from "./getters";

export const useSystemStore = defineStore('system',{
    state: () => (state),
    getters
})