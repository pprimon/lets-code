import { defaultService } from './commons/http'

export const getCards = (token) => {
    return defaultService(token, true).get(`/cards`)
}

export const addCard = (card,token) => {
    return defaultService(token, true).post(`/cards`, card)
}

export const updateCard = (card, id, token) => {
    return defaultService(token, true).put(`/cards/${id}`, card)
}

export const deleteCard = (id, token) => {
    return defaultService(token, true).delete(`/cards/${id}`)
}