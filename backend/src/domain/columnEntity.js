export default class Column {
  constructor({ id, name, board, position, color = '#6B7280', createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.board = board;
    this.position = position;
    this.color = color;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updatePosition(newPosition) {
    this.position = newPosition;
  }

  updateName(newName) {
    this.name = newName;
  }

  updateColor(newColor) {
    this.color = newColor;
  }
}
