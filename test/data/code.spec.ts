declare var gettext: any;

class TestClass {
  someMethod() {
    gettext('This string should NOT be extracted');
  }
}
