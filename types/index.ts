// User types
export interface User {
    id: number
    email: string
    name: string
    profileIcon?: string | null
    createdAt: Date
}

export interface UserWithPassword extends User {
    password: string
}

// Family types
export interface FamilyGroup {
    id: number
    name: string
    createdBy: number
    createdAt: Date
}

export interface FamilyMember {
    id: number
    groupId: number
    userId: number
    role: 'admin' | 'member'
    joinedAt: Date
    user?: User
}

// Location types
export interface Location {
    id: number
    userId: number
    latitude: number
    longitude: number
    accuracy?: number | null
    timestamp: Date
}

export interface MarkedLocation {
    id: number
    groupId: number
    name: string
    type: 'home' | 'work' | 'school' | 'other'
    latitude: number
    longitude: number
    radius: number
    notifyOnArrival: boolean
    createdBy: number
    createdAt: Date
}

// Invitation types
export interface Invitation {
    id: number
    groupId: number
    email: string
    code: string
    qrCode?: string | null
    status: 'pending' | 'accepted' | 'expired' | 'rejected'
    expiresAt: Date
    createdAt: Date
}

// Smart tag types
export interface SmartTag {
    id: number
    userId: number
    tagType: 'samsung' | 'apple' | 'other'
    tagId: string
    name: string
    lastLatitude?: number | null
    lastLongitude?: number | null
    lastSeen?: Date | null
    createdAt: Date
}

// Notification types
export interface Notification {
    id: number
    userId: number
    type: 'arrival' | 'departure' | 'invite' | 'system'
    title: string
    message: string
    read: boolean
    metadata?: string | null
    createdAt: Date
}

// API Request/Response types
export interface RegisterRequest {
    email: string
    password: string
    name: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface InviteRequest {
    email: string
    groupId?: number
}

export interface AcceptInviteRequest {
    code: string
}

export interface LocationUpdateRequest {
    latitude: number
    longitude: number
    accuracy?: number
}

export interface CreateMarkedLocationRequest {
    name: string
    type: 'home' | 'work' | 'school' | 'other'
    latitude: number
    longitude: number
    radius?: number
    notifyOnArrival?: boolean
}

export interface AddSmartTagRequest {
    tagType: 'samsung' | 'apple' | 'other'
    tagId: string
    name: string
}

export interface UpdateSmartTagLocationRequest {
    tagId: number
    latitude: number
    longitude: number
}

// Map types
export interface MapMarker {
    id: number
    type: 'user' | 'location' | 'tag'
    name: string
    latitude: number
    longitude: number
    icon?: string
    color?: string
}
