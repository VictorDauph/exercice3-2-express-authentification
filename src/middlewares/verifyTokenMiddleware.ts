import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { cp } from 'fs';
import { verifyToken } from '../utils/JWTUtils';

//Chargement des variables d'environnement
dotenv.config();


//la clé secrète est nécessaire pour decrypter le token
const SECRET_KEY = process.env.JWT_KEY

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (SECRET_KEY === undefined) {
        throw new Error("SECRET_KEY non présente dans les variables d'environnement")
    }

    //Recupérer le token dans les cookies
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: "Access denies. COokie missing" });
        return;
    }

    //le cookie contient une donnée sous la forme jwt=....
    const token = cookie.split('=')[1];
    console.log(token);

    //Vérifier si le token est présent
    if (!token) {
        res.status(401).json({ message: 'Access Denied. Token Missing.' })
        return;
    }

    try {
        //Vérifier le token
        const decoded = verifyToken(token);

        //on ajoute les données décodées dans la requête
        req.headers.payload = JSON.stringify(decoded);

        if (!decoded) {
            res.status(403).send({ message: 'Token invalide ou expiré' })
            return
        }

        //passer au middleware suivant (ou au contrôleur)
        next();
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}