import * as React from 'react';
import { Player } from 'sets-game-engine';
interface Props {
    package: string;
    onReady: (players: Player[]) => void;
}
interface State {
    name: string;
}
export default class Menu extends React.Component<Props, State> {
    constructor(props: Props);
    startSolo: () => void;
    render(): JSX.Element;
}
export {};
