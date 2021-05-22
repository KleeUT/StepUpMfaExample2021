import express, { NextFunction, Request, Response } from "express";
import jwks from "jwks-rsa";
import jwtMiddleware from "express-jwt";
import isBefore from "date-fns/isBefore";
import subMinutes from "date-fns/subMinutes";
const server = express();

type TokenClaims = {
  user?: {
    "https://kleeut.com:mfaTime"?: string;
    iss: string;
    sub: string;
    aud: string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
  };
};

var jwtCheck = jwtMiddleware({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://kleeut-stepup-example.au.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://kleeut-stepup-example.au.auth0.com/api/v2/",
  issuer: "https://kleeut-stepup-example.au.auth0.com/",
  algorithms: ["RS256"],
});

server.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});

server.get("/public", (req: Request, res: Response): void => {
  res.json({ hello: "world" });
});

server.get(
  "/private",
  jwtCheck,
  (req: Request & { user?: unknown }, res: Response): void => {
    console.log(req.user);

    res.json({ authenticated: true });
  }
);

function itHasBeenLessThanAMinuteSince(date: Date): boolean {
  console.log("A minute ago and date", subMinutes(Date.now(), 1), date);
  return isBefore(subMinutes(Date.now(), 1), date);
}

function mfaRequired(
  req: Request & TokenClaims,
  res: Response,
  next: NextFunction
) {
  console.log(req.user);
  const mfaTime = req.user?.["https://kleeut.com:mfaTime"];
  if (mfaTime && itHasBeenLessThanAMinuteSince(new Date(mfaTime))) {
    console.log(`MFA time is good ${mfaTime}`);
    next();
    return;
  }
  console.log(`MFA rejected, ${mfaTime}`);
  res.status(401).json({
    code: "mfaRequired",
    message: "Recent MFA is required to access this endpoint",
  });
}

server.get(
  "/stepUpMfaEndpoint",
  jwtCheck,
  mfaRequired,
  (req: Request, res: Response): void => {
    res.json({
      authenticated: true,
      mfa: true,
    });
  }
);

server.listen(8080);
