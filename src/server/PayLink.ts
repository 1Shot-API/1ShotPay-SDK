import {
  EPayLinkStatus,
  EVMAccountAddress,
  PayLinkId,
  PayLinkPaymentId,
  RelayerTransactionId,
  TransactionHash,
  UnixTimestamp,
  URLString,
  USDCAmount,
  UserId,
  Username,
} from "@1shotapi/1shotpay-common";

export interface IPayLinkPayment {
  id: PayLinkPaymentId;
  payLinkId: PayLinkId;
  amount: USDCAmount;
  relayerTransactionId: RelayerTransactionId;
  transactionHash: TransactionHash | null;
  paidByUserId: UserId;
  createdTimestamp: UnixTimestamp;
  updatedTimestamp: UnixTimestamp;
}

export interface IPayLink {
  id: PayLinkId;
  userId: UserId;
  username: Username;
  accountAddress: EVMAccountAddress;
  profileImageUrl: URLString | null;
  status: EPayLinkStatus;
  amount: USDCAmount;
  description: string;
  mediaUrl: URLString | null;
  expirationTimestamp: UnixTimestamp;
  reuseable: boolean;
  payerDefinedAmount: boolean;
  requestedPayerUserId: UserId | null;
  archived: boolean;
  ignoredByRequestedPayer: boolean;
  paymentCount: number;
  deletable: boolean;
  mostRecentPayment: IPayLinkPayment | null;
  createdTimestamp: UnixTimestamp;
  updatedTimestamp: UnixTimestamp;
}
