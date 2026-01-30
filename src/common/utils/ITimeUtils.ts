import {
  ISO8601DateString,
  MillisecondTimestamp,
  UnixTimestamp,
} from "types/primitives";

export interface ITimeUtils {
  getUnixNow(): UnixTimestamp;
  getMillisecondNow(): MillisecondTimestamp;
  getISO8601TimeString(time: MillisecondTimestamp): ISO8601DateString;
  convertTimestampToISOString(unixTimestamp: UnixTimestamp): ISO8601DateString;
  convertISOStringToTimestamp(isoString: ISO8601DateString): UnixTimestamp;
  getUnixTodayStart(): UnixTimestamp;
  getUnixTodayEnd(): UnixTimestamp;
  getStartOfMonth(): UnixTimestamp;
}

export const ITimeUtilsType = Symbol.for("ITimeUtils");
