export enum RequestEnum {
    PENDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
}

export enum RequestTypeEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export enum RequestContentTypeEnum {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM_URLENCODED = "application/x-www-form-urlencoded"
}