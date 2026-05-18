import { JwtAccessPayload } from "../utility/tokens.ts";

declare global {
    namespace Express {
        interface Request {
            user? : JwtAccessPayload
        }
    }
}