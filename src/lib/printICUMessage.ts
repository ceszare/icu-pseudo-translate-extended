// swiped from https://raw.githubusercontent.com/yahoo/react-intl/master/examples/translations/scripts/lib/printer.js
const ESCAPED = {
  '\\': '\\\\',
  '\\#': '\\#',
  '{': '\\{',
  '}': '\\}'
};
const ESCAPE_REGEX = /\\#|[{}\\]/g;

export function printICUMessage(ast) {
  return ast.elements.reduce((msg, el) => {
    const { format, id, type, value } = el;
    let message: string = msg;

    if (type === 'messageTextElement') {
      return message + value.replace(ESCAPE_REGEX, char => ESCAPED[char]);
    }

    if (!format) {
      return message + `{${id}}`;
    }

    let formatType = format.type.replace(/Format$/, '');
    let style;
    let offset;
    let options;

    switch (formatType) {
      case 'number':
      case 'date':
      case 'time':
        style = format.style ? `, ${format.style}` : '';
        message += `{${id}, ${formatType}${style}}`;
        break;

      case 'plural':
      case 'select':
        offset = format.offset ? `, offset:${format.offset}` : '';
        options = format.options.reduce((str, option) => {
          const optionValue = printICUMessage(option.value);
          return str + ` ${option.selector} {${optionValue}}`;
        }, '');
        if (format.ordinal && formatType === 'plural') {
          formatType = 'selectordinal';
        }
        message += `{${id}, ${formatType}${offset},${options}}`;
        break;
    }
    return message;
  }, '');
}
