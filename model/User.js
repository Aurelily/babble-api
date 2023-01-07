class User {
  constructor(email, password, firstname, lastname) {
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

module.exports = { User };
