import { Result } from "../type/result"


export const clearLS = () => {
  localStorage.removeItem('profile')
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: Result) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}