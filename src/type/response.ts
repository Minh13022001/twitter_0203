import { Result } from "./result"

export interface Response {
    dates: {
      maximum: string
      minimum: string
    }
    page: number
    results: Result[] | undefined
    total_pages: number
    total_results: number
  }