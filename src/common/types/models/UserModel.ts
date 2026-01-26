import {
  EVMAccountAddress,
  URLString,
  UserId,
  Username,
} from "types/primitives";

export interface IUserModel {
  id: UserId;
  username: Username;
  accountAddress: EVMAccountAddress;
  profileText: string | null;
  profileImageUrl: URLString | null;
  accountRecoveryDataCreated: boolean;
  hasApiToken: boolean;
}
