export class FetchUserQuery {
    constructor(public id: string | null, public email: string | null) {
        if (!id && !email) {
            throw new Error("No credentials provided")
        }
    }
}
