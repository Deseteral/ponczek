import { PriorityQueue } from 'ponczek/data/priority-queue';
import { Vector2 } from 'ponczek/math/vector2';

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const DIRECTIONS_WITH_DIAGONALS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

/**
 * A* pathfinding in two dimensional grid.
 */
export class Pathfinder {
  private graph: number[];
  private width: number;
  private height: number;

  /**
   * Creates new pathfinder for a graph of given size.
   */
  constructor(width: number, height: number) {
    this.graph = new Array(width * height);
    this.width = width;
    this.height = height;

    for (let idx = 0; idx < this.graph.length; idx += 1) {
      this.graph[idx] = 1;
    }
  }

  /**
   * Sets the cost of movement to n-th tile.
   */
  public setCost(idx: number, cost: number): void {
    this.graph[idx] = cost;
  }

  /**
   * Returns array of coordinates that make up the path from start node to end node.
   * Start/end node is described as coordinate pair (x-column, y-row).
   * When the path does not exist - an empty array will be returned.
   */
  public search(startX: number, startY: number, endX: number, endY: number, withDiagonals: boolean = false): Vector2[] {
    const startIdx = startX + (startY * this.width);
    const endIdx = endX + (endY * this.width);

    const indices = this.searchIdx(startIdx, endIdx, withDiagonals);
    const path = new Array(indices.length);
    for (let it = 0; it < indices.length; it += 1) {
      const idx = indices[it];
      path[it] = new Vector2((idx % this.width) | 0, (idx / this.width) | 0);
    }

    return path;
  }

  /**
   * Returns array of coordinates that make up the path from start node to end node.
   * Start/end node is described as tile-index pair.
   * When the path does not exist - an empty array will be returned.
   */
  public searchIdx(start: number, end: number, withDiagonals: boolean = false): number[] {
    if (this.graph[end] === 0) {
      return [];
    }

    const frontier = new PriorityQueue(this.width * this.height);
    frontier.push(start, 0);
    const cameFrom = new Map<number, number>();
    const costSoFar = new Map<number, number>();
    cameFrom.set(start, -1);
    costSoFar.set(start, 0);

    while (frontier.size !== 0) {
      const current = frontier.pop()!;

      if (current === end) {
        break;
      }

      const neighbors = this.neighbors(current, withDiagonals);

      for (let idx = 0; idx < neighbors.length; idx += 1) {
        const next = neighbors[idx];
        const newCost = costSoFar.get(current)! + this.graph[next];

        if (costSoFar.has(next) === false || newCost < costSoFar.get(next)!) {
          costSoFar.set(next, newCost);
          const priority = newCost + this.manhattanHeuristic(end, next);
          frontier.push(next, priority);
          cameFrom.set(next, current);
        }
      }
    }

    const path = [end];
    let next = end;
    while (next !== start) {
      const previous = cameFrom.get(next)!;
      path.unshift(previous);
      next = previous;
    }

    return path;
  }

  private neighbors(idx: number, withDiagonals: boolean = false): number[] {
    const x = (idx % this.width) | 0;
    const y = (idx / this.width) | 0;
    const n = [];

    const dirs = withDiagonals ? DIRECTIONS_WITH_DIAGONALS : DIRECTIONS;

    for (let di = 0; di < dirs.length; di += 1) {
      const nx = x + dirs[di][0];
      const ny = y + dirs[di][1];

      if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
        continue;
      }

      const nidx = nx + (ny * this.width);
      if (this.graph[nidx] === 0) continue;

      n.push(nidx);
    }

    return n;
  }

  private manhattanHeuristic(a: number, b: number): number {
    const ax = (a % this.width) | 0;
    const ay = (a / this.width) | 0;
    const bx = (b % this.width) | 0;
    const by = (b / this.width) | 0;

    return Math.abs(ax - bx) + Math.abs(ay - by);
  }
}
