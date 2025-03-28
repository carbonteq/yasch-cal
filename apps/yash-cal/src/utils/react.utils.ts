import React from "react";

const isReactElement = (arg: unknown) => {
    return React.isValidElement(arg);
};

const passExtraPropToChildren = (children: React.ReactNode, extraProp: Record<string, unknown>) => {
    return React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, extraProp);
    });
};

export const ReactUtils = {
    isReactElement,
    passExtraPropToChildren
};
