import { ResultAsync } from "neverthrow";

import {
  PayLinkId,
  UnixTimestamp,
  URLString,
  UserId,
  DecimalAmount,
  AjaxError,
} from "@1shotapi/1shotpay-common";
import { IPayLink } from "./PayLink";

export interface IOneShotPayServer {
  createPayLink(
    amount: DecimalAmount,
    description: string,
    options?: IPayLinkOptions,
  ): ResultAsync<IPayLink, AjaxError>;

  getPayLink(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError>;

  waitForPayLinkPayment(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError>;
}

export interface IPayLinkOptions {
  mediaUrl?: URLString;
  reuseable?: boolean;
  expirationTimestamp?: UnixTimestamp;
  requestedPayerUserId?: UserId;
}
