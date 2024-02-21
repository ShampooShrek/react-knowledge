import { Request, Response, NextFunction } from "express"
import { verify, VerifyErrors, JwtPayload } from "jsonwebtoken"


const TokenVerify = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1]

  if (!token) return res.status(401).json({ type: "error", response: "Requesição sem token!" })

  try {
    verify(token, `${process.env.JWT_KEY}`, (err, value) => {
      if (err) return res.status(401).json({ type: "error", response: "Token inválido" })

      if (value && typeof value !== "string") {
        req.body.userId = Number(value.userId)
        req.body.admin = Number(value.admin)
        console.log(value)
        next()
      }
    })
  } catch (err: any) {
    return res.status(401).json({ type: "error", response: "Sem autorização" })
  }
}

export default TokenVerify
