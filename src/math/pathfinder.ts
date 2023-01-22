import { PriorityQueue } from 'ponczek/data/priority-queue';

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export class Pathfinder {
  private graph: number[];
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.graph = new Array(width * height);
    this.width = width;
    this.height = height;

    for (let idx = 0; idx < this.graph.length; idx += 1) {
      this.graph[idx] = 1;
    }
  }

  public setWeight(idx: number, weight: number): void {
    this.graph[idx] = weight;
  }

  public search(startX: number, startY: number, endX: number, endY: number): number[][] {
    const startIdx = startX + (startY * this.width);
    const endIdx = endX + (endY * this.width);

    const indices = this.searchIdx(startIdx, endIdx);
    const path = new Array(indices.length);
    for (let it = 0; it < indices.length; it += 1) {
      const idx = indices[it];
      path[it] = [((idx % this.width) | 0), ((idx / this.width) | 0)];
    }

    return path;
  }

  public searchIdx(start: number, end: number): number[] {
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

      const neighbors = this.neighbors(current);

      for (let idx = 0; idx < neighbors.length; idx += 1) {
        const next = neighbors[idx];
        const newCost = costSoFar.get(current)! + this.graph[next];

        if (costSoFar.has(next) === false || newCost < costSoFar.get(next)!) {
          costSoFar.set(next, newCost);
          const priority = newCost + this.heuristic(end, next);
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

  private neighbors(idx: number): number[] {
    const x = (idx % this.width) | 0;
    const y = (idx / this.width) | 0;
    const n = [];

    for (let di = 0; di < DIRECTIONS.length; di += 1) {
      const nx = x + DIRECTIONS[di][0];
      const ny = y + DIRECTIONS[di][1];

      if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
        continue;
      }

      const nidx = nx + (ny * this.width);

      if (this.graph[nidx] === 0) {
        continue;
      }

      n.push(nidx);
    }

    return n;
  }

  private heuristic(a: number, b: number): number {
    const ax = (a % this.width) | 0;
    const ay = (a / this.width) | 0;
    const bx = (b % this.width) | 0;
    const by = (b / this.width) | 0;

    return Math.abs(ax - bx) + Math.abs(ay - by);
  }
}
