import { JsonWebToken } from "../primitives";

export class OAuthTokenModel {
  public constructor(
    public readonly access_token: JsonWebToken,
    public readonly token_type: "Bearer",
    public readonly expires_in: number,
  ) {}
}
