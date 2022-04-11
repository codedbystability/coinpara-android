class TransferDirection {


  constructor(id) {
    this.id = id;
    this.type = id === 1 ? "deposit" : "withdraw";
  }


  getType() {
    return this.type;
  }

}

export default TransferDirection;
