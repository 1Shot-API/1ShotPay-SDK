import { okAsync, ResultAsync } from "neverthrow";

import {
  JsonWebToken,
  PayLinkId,
  USDCAmount,
  UserId,
  Username,
  ITimeUtils,
  TimeUtils,
  UnixTimestamp
} from "@1shotapi/1shotpay-common";
import { AjaxError } from "@1shotapi/1shotpay-common";
import { IPayLink } from "./PayLink";
import { IOneShotPayServer } from "./IOneShotPayServer";

export class OneShotPayServer implements IOneShotPayServer {
  protected currentJWT = JsonWebToken("");
  protected currentJWTExpiresAt = UnixTimestamp(0);
  protected timeUtils: ITimeUtils;
  public constructor(protected readonly userId: UserId, protected readonly apiToken: string) {
    this.timeUtils = new TimeUtils();
  }
  public createPayLink(amount: USDCAmount, description: string, fromUsername: Username): ResultAsync<IPayLink, AjaxError> {}

  public getPayLink(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError> {}

  public waitForPayLinkPayment(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError> {

  }

  protected getRelayerJWT(
    config: Config,
  ): ResultAsync<JsonWebToken, AjaxError> {
    // If there is more than 10 minutes left on the JWT, return the existing JWT
    if (
      this.currentJWT != "" &&
      this.currentJWTExpiresAt > this.timeUtils.getUnixNow() + 10 * 60
    ) {
      return okAsync(this.currentJWT);
    }

    return ResultAsync.fromPromise(fetch(new URL(`https://1shotpay.com/api/m2m/v0/token`), {
        client_id: config.relayer.apiKey,
        client_secret: config.relayer.apiSecret,
        grant_type: "client_credentials",
      })
      .map((response) => {
        this.currentJWT = response.access_token;
        this.currentJWTExpiresAt = UnixTimestamp(
          this.timeUtils.getUnixNow() + response.expires_in,
        );
        return this.currentJWT;
      });
  }

}
