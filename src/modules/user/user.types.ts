
type Avatar = {
    url : string,
    public_id : string
}

type Role = "user" | "admin";

export type CreateUserView = {
    name : string,
    email : string,
    passwordHash : string,
    role : Role,
    avatar : Avatar,
    city : string
}


export type LoginUserView = {
    email : string,
    passwordHash : string
}


export interface UserPayload {
    _id : string,
    name : string,
    role : Role,
    email : string
}


export type UpdateUserView = {
    name? : string | undefined,
    email? : string | undefined,
    avatar? : Avatar | undefined,
    city? : string | undefined
}

export type UpdatePasswordView = {
    newPassword : string,
    oldPassword : string
}

export type RefTokenPayloadView = {
    _id : string,
    refreshToken : string
}