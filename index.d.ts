declare module 'terminal-in-react' {
    import Component = React.Component;
    import CSSProperties = React.CSSProperties;

    export default class Terminal extends Component<{
        style?: CSSProperties;
        color?: string;
        outputColor?: string;
        backgroundColor?: string;
        prompt?: string;
        barColor?: string;
        description?: {};
        commands?: {};
        msg?: string;
        watchConsoleLogging?: boolean;
        commandPassThrough?: (cmd: string, print: () => void) => void;
        promptSymbol?: string;
        plugins?: any[];
        startState?: 'open' | 'maximised' | 'minimised' | 'closed';
        showActions?: boolean;
        hideTopBar?: boolean;
        allowTabs?: boolean;
        actionHandlers?: {
            handleClose?: (toogleClose: () => void) => void;
            handleMaximise?: (toggleMaximise: () => void) => void;
            handleMinimise?: (toggleMinimise: () => void) => void;
        };
    }> {}
}
