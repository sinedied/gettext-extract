declare var gettext: any;
declare var ngettext: any;
declare var pgettext: any;

class ExtractTest {
  someMethod() {
    gettext('Text from TypeScript');
    ngettext('One text from TypeScript', 'Many texts from TypeScript');
    pgettext('Some context', 'Another text from TypeScript');
  }
}
