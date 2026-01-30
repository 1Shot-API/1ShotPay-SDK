import {
  BigNumberString,
  EVMAccountAddress,
  HexString,
  Signature,
  UnixTimestamp,
} from "types/primitives";

export interface IERC3009TransferWithAuthorization {
  from: EVMAccountAddress;
  to: EVMAccountAddress;
  value: BigNumberString;
  validAfter: UnixTimestamp;
  validBefore: UnixTimestamp;
  nonce: HexString;
}

export interface ISignedERC3009TransferWithAuthorization extends IERC3009TransferWithAuthorization {
  signature: Signature;
}

export interface IPermitTransfer {
  owner: EVMAccountAddress;
  spender: EVMAccountAddress;
  value: BigNumberString;
  nonce: BigNumberString;
  deadline: UnixTimestamp;
}

export interface ISignedPermitTransfer extends IPermitTransfer {
  signature: Signature;
}
