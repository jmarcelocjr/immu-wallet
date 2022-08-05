export declare type SQLValue = null | string | number | Uint8Array;
export declare type OperatorType = "$notEqual" | "$lessThan" | "$lessThanOrEqual" | "$moreThan" | "$moreThanOrEqual" | "$equal" | "$notLike" | "$like";

export declare type FindParameter<T> = {
    [key:string]: T | WithOperatorType<T>;
};

export declare type WithOperatorType<T> = {
    [type in OperatorType]?: T;
};

export const isWithOperatorType = (object): object is WithOperatorType<any> => {
    return object instanceof Object
        && ["$notEqual", "$lessThan", "$lessThanOrEqual", "$moreThan", "$moreThanOrEqual", "$equal", "$notLike", "$like"].includes(Object.keys(object)[0]);
};