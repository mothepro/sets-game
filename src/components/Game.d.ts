import * as React from 'react';
import { Player, Game } from 'sets-game-engine';
interface Props {
    players: Player[];
}
interface State {
    game: Game;
}
export default class GameUI extends React.Component<Props, State> {
    private game;
    constructor(props: Props);
    render: () => JSX.Element;
}
export {};
