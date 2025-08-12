export interface User {
  id: string
  name: string
  email: string
  nickname?: string
  avatar?: string
}

export interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  status: "planning" | "upcoming" | "ongoing" | "completed"
  coverImage?: string
  participants: number
  photos: number
  description?: string
}

export interface TripCreate {
  title: string
  destination: string
  startDate: string
  endDate: string
  description?: string
}

export interface PopularTrip {
  id: string
  title: string
  destination: string
  author: string
  likes: number
  coverImage?: string
}
