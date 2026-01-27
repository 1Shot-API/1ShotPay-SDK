import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  JsonWebToken,
  PayLinkId,
  UserId,
  ITimeUtils,
  TimeUtils,
  UnixTimestamp,
  IAjaxUtils,
  AjaxUtils,
  AjaxError,
  OAuthTokenModel,
  DecimalAmount,
  EPayLinkStatus,
  RetryError,
} from "@1shotapi/1shotpay-common";
import { IPayLink } from "./PayLink";
import { IOneShotPayServer, IPayLinkOptions } from "./IOneShotPayServer";

import { ResultUtils } from "neverthrow-result-utils";

export class OneShotPayServer implements IOneShotPayServer {
  protected currentJWT = JsonWebToken("");
  protected currentJWTExpiresAt = UnixTimestamp(0);
  protected timeUtils: ITimeUtils;
  protected ajaxUtils: IAjaxUtils;

  public constructor(
    protected readonly userId: UserId,
    protected readonly apiToken: string,
  ) {
    this.timeUtils = new TimeUtils();
    this.ajaxUtils = new AjaxUtils();
  }

  public createPayLink(
    amount: DecimalAmount,
    description: string,
    options?: IPayLinkOptions,
  ): ResultAsync<IPayLink, AjaxError> {
    return this.ajaxUtils.post<IPayLink>(
      `http://1shotpay.com/api/m2m/v0/links`,
      {
        amount: amount,
        description,
        mediaUrl: options?.mediaUrl,
        reuseable: options?.reuseable ? true : false,
        expirationTimestamp: options?.expirationTimestamp,
        requestedPayerUserId: options?.requestedPayerUserId,
      },
    );
  }

  public getPayLink(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError> {
    return this.ajaxUtils.get<IPayLink>(
      `http://1shotpay.com/api/m2m/v0/links/${payLinkId}`,
    );
  }

  public waitForPayLinkPayment(
    payLinkId: PayLinkId,
  ): ResultAsync<IPayLink, AjaxError> {
    return ResultUtils.backoffAndRetry(
      () => {
        return this.getPayLink(payLinkId).andThen((payLink) => {
          if (payLink.status === EPayLinkStatus.Paid) {
            return okAsync(payLink);
          }
          return errAsync(RetryError.fromError(new Error("Pay link not paid")));
        });
      },
      [Error],
      undefined, // max
      5, // baseSeconds
    ).mapErr((err) => {
      if (RetryError.isError(err)) {
        return AjaxError.fromError(err);
      }
      return err;
    });
  }

  protected getRelayerJWT(): ResultAsync<JsonWebToken, AjaxError> {
    // If there is more than 10 minutes left on the JWT, return the existing JWT
    if (
      this.currentJWT != "" &&
      this.currentJWTExpiresAt > this.timeUtils.getUnixNow() + 10 * 60
    ) {
      return okAsync(this.currentJWT);
    }

    return this.ajaxUtils
      .post<OAuthTokenModel>(
        `https://1shotpay.com/api/m2m/v0/token`,
        {
          client_id: this.userId,
          client_secret: this.apiToken,
          grant_type: "client_credentials",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .map((response) => {
        this.currentJWT = response.access_token;
        this.currentJWTExpiresAt = UnixTimestamp(
          this.timeUtils.getUnixNow() + response.expires_in,
        );
        return this.currentJWT;
      });
  }
}
