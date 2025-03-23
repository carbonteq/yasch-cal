import React from "react";

const isReactElement = (arg: unknown) => {
    return React.isValidElement(arg);
};

export const ReactUtils = {
    isReactElement
};
