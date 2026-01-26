import { ResultAsync } from "neverthrow";

import {
  PayLinkId,
  USDCAmount,
  Username,
} from "@1shotapi/1shotpay-common";
import { AjaxError } from "@1shotapi/1shotpay-common";
import { IPayLink } from "./PayLink";

export interface IOneShotPayServer {
  createPayLink(amount: USDCAmount, description: string, fromUsername: Username): ResultAsync<IPayLink, AjaxError>;

  getPayLink(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError>;

  waitForPayLinkPayment(payLinkId: PayLinkId): ResultAsync<IPayLink, AjaxError>;
}
