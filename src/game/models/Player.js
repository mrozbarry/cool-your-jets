import KeyboardInput from '#/game/inputs/Keyboard';
import GamepadInput from '#/game/inputs/Gamepad';

const keyboardInputMap = {
  wasd: () => KeyboardInput.WASD(),
  arrows: () => KeyboardInput.Arrows(),
};

export default class Player {
  static inputFrom(controls) {
    console.log('Player.inputFrom', controls);
    const [inputType, subType] = controls.split('|');
    switch (inputType) {
    case 'keyboard': return keyboardInputMap[subType]();
    case 'gamepad': return new GamepadInput(Number(subType));
    }
    return null;
  }

  constructor(id, { name, controls, color, wins }, ship) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.controls = controls;
    this.input = Player.inputFrom(controls);

    this.wins = wins;
    this.ship = ship;
    this.alive = true;
  }
}
