export interface AccessToken {
    client_id: string,
    client_secret: string,
    grant_type?: string,
    redirect_uri: string,
    code: string,
}