import * as React from 'react';
import { Player } from 'sets-game-engine';
interface Props {
    package: string;
}
interface State {
    light: boolean;
    players?: Player[];
}
export default class App extends React.Component<Props, State> {
    private static darkTheme;
    private static lightTheme;
    constructor(props: Props);
    /** Switches Material UI Theme and body's background color */
    toggleTheme: () => void;
    render(): JSX.Element;
}
export {};
