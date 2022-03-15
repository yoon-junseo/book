class Book {
  _reservations = [];

  get reservation() {
    return this._reservations;
  }

  addReservation(customer, isPriority) {
    if (isPriority) {
      this._reservations.push(customer);
    }
  }
}

const bookcafe = new Book();
bookcafe.addReservation({ name: "roy" }, true);
bookcafe.addReservation({ name: "jay" }, false);
console.log(bookcafe.reservation);
