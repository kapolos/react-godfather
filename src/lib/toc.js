import { Godfather } from './godfather'

export const toC = (f, events = ['onClick'], opts) => props => Godfather(f, props, events, opts)
