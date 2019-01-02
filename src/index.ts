import serializer from 'dom-serializer';
import { DomHandler, Parser } from 'htmlparser2';
import intlMessageFormatParser from 'intl-messageformat-parser';
import pseudolocalization from 'pseudo-localization';

import { printICUMessage } from './lib/printICUMessage';

function translateDom(domArray, useBidiMode) {
  return domArray.map(node => {
    if (node.type === 'text') {
      const localizationStrategy = useBidiMode ? 'bidi' : 'accented';
      node.data = pseudolocalization.localize(node.data, { strategy: localizationStrategy });
    }
    if (node.children) {
      node.children = translateDom(node.children, useBidiMode);
    }
    return node;
  });
}

export function translateText(text, useBidiMode = false) {
  let pseudoText;
  const handler = new DomHandler((err, domArray) => {
    if (err) {
      throw err;
    }
    pseudoText = serializer(translateDom(domArray, useBidiMode));
  });
  const parser = new Parser(handler);
  parser.parseComplete(text);
  return pseudoText;
}

// heavily inspired by:
// https://github.com/yahoo/react-intl/blob/master/examples/translations/scripts/lib/translator.js
export function transform(ast, useBidiMode = false) {
  ast.elements.forEach(el => {
    if (el.type === 'messageTextElement') {
      el.value = translateText(el.value, useBidiMode);
    } else {
      const options = el.format && el.format.options;
      if (options) {
        options.forEach(option => transform(option.value, useBidiMode));
      }
    }
  });
  return ast;
}

export function pseudoTranslate(msg, useBidiMode = false) {
  const ast = intlMessageFormatParser.parse(msg);
  const translated = transform(ast, useBidiMode);
  return printICUMessage(translated);
}
