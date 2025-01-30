import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

const SECRET_KEY: string | undefined = process.env.JWT_KEY;



export function generateToken(payload: JwtPayload): string {
    if (SECRET_KEY === undefined) {
        throw new Error("JWT_KEY n'est pas présente dans les variables d'environnement")
    }

    //Génère un token sogné avec les données du payload, et le crypte avec la clé secrète
    //le tokeb expire dans une heure/
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
}

export function verifyToken(token: string): string | JwtPayload | null {
    if (SECRET_KEY === undefined) {
        throw new Error("JWT_KEY n'est pas présente dans les variables d'environnement")
    }
    try {
        //Vérifie la validité du tokent à l'aide de la clé secrète.
        //Si le tokent est valude, retourne le payload contenu dans le token.
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null
    }
}

export function getUserIdFromPayload(payloadJson: string): string | null {
    const payload = JSON.parse(payloadJson) || null;
    return payload.id || null
}