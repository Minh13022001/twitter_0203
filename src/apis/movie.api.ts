import { Response } from "../type/response";
import http from "../utils/https";



const URL = 'movie/'
const getMovie = {
    nowPlaying(params: {language: string; page: number; api_key: string}) {
        return http.get<Response>(`${URL}now_playing`, {
            params
        })
    }
}

export default getMovie