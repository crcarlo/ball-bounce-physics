interface IPoint {
  x: number;
  y: number;
  id: string;
  draggable: boolean;
}

interface IState {
  points: IPoint[];
  dragging?: string;
}
