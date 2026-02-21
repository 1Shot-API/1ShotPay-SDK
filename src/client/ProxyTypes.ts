import {
  EVMAccountAddress,
  EVMAccountAddressSchema,
  BigNumberStringSchema,
  JSONString,
  UnixTimestampSchema,
  UsernameSchema,
  USDCAmountSchema,
  IUserModel,
} from "@1shotapi/1shotpay-common";
import z from "zod";

export const rpcCallbackEventName = "rpcCallback";

export interface IRPCWrapperParams<T> {
  eventName: string;
  callbackNonce: number;
  params: T;
}

export interface IRPCWrapperReturn {
  success: boolean;
  callbackNonce: number;
  result: JSONString;
}

export interface IAuthenticationResult {
  success: boolean;
  walletUnlocked: boolean;
  user?: IUserModel;
  error?: string;
  canRetry?: boolean;
}

export const signInParamsSchema = z.object({
  username: UsernameSchema,
});

export type ISignInParams = z.infer<typeof signInParamsSchema>;

export const getERC3009SignatureParamsSchema = z.object({
  recipient: z.string(),
  destinationAddress: EVMAccountAddressSchema,
  amount: BigNumberStringSchema,
  validUntil: UnixTimestampSchema,
  validAfter: UnixTimestampSchema,
});

export type IGetERC3009SignatureParams = z.infer<
  typeof getERC3009SignatureParamsSchema
>;

export const getPermitSignatureParamsSchema = z.object({
  recipient: z.string(),
  destinationAddress: EVMAccountAddressSchema,
  amount: BigNumberStringSchema,
  nonce: BigNumberStringSchema,
  deadlineSeconds: z.number(),
});

export type IGetPermitSignatureParams = z.infer<
  typeof getPermitSignatureParamsSchema
>;

// export interface ICreateDelegationParams {}

export interface IGetAccountAddressResponse {
  accountAddress: EVMAccountAddress;
}

/**
 * Params for getSubscription - approve a subscription (delegation) for a 3rd party.
 * Exactly one of amountPerDay, amountPerWeek, amountPerMonth must be set.
 * All amount fields must be null/undefined or positive integers (no decimals).
 */
export const getSubscriptionParamsSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    destinationAccountAddress: EVMAccountAddressSchema,
    amountPerDay: USDCAmountSchema.optional(),
    amountPerWeek: USDCAmountSchema.optional(),
    amountPerMonth: USDCAmountSchema.optional(),
  })
  .refine(
    (data) => {
      const count = [
        data.amountPerDay,
        data.amountPerWeek,
        data.amountPerMonth,
      ].filter((x) => x != null).length;
      return count === 1;
    },
    {
      message:
        "Exactly one of amountPerDay, amountPerWeek, amountPerMonth must be set",
    },
  );

export type IGetSubscriptionParams = z.infer<
  typeof getSubscriptionParamsSchema
>;
