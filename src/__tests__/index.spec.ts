import { oneLine } from 'common-tags';
import 'mutationobserver-shim';

import { pseudoTranslate, transform, translateText } from '../';
import expectedAstBidi from './ast.bidi.expected.json';
import expectedAst from './ast.expected.json';
import ast from './ast.json';

describe('translateText fn', () => {
  it('translates text into pseudo translations', () => {
    const test = oneLine`<do _not="translate this">Translate <yes>This</yes></do>. There is unicode in heré! ôØh Nö!`;
    const result = translateText(test);
    expect(result).toBe(
            '<do _not=\"translate this\">Ŧřȧȧƞşŀȧȧŧḗḗ <yes>Ŧħīş</yes></do>. Ŧħḗḗřḗḗ īş ŭŭƞīƈǿǿḓḗḗ īƞ ħḗḗřé! ôØħ Ƞö!'
        );
  });
  it('should support bidirectional language.', () => {
    const test = 'Convert this to bidi mode.';
    const result = translateText(test, true);
    expect(result).toEqual('‮Ↄouʌǝɹʇ ʇɥıs ʇo qıpı ɯopǝ.‬');
  });
});
describe('transform fn', () => {
  it('translates only messageTextElements in an ast', () => {
    const result = transform(JSON.parse(JSON.stringify(ast)));
    expect(result).toEqual(expectedAst);
  });

  it('should support bidirectional language translation.', () => {
    const resultBidi = transform(JSON.parse(JSON.stringify(ast)), true);
    expect(resultBidi).toEqual(expectedAstBidi);
  });
});

describe('pseudoTranslate fn', () => {
  it('translates an ICU message with a {plural}', () => {
    const testMsg = oneLine`On {takenDate, date, short} {name} took {numPhotos, plural,
            =0 {no photos.}
            =1 {one photo.}
            other {# photos.}}`;

    const expectedMsg = oneLine`ǾǾƞ {takenDate, date, short} {name} ŧǿǿǿǿķ {numPhotos, plural,
            =0 {ƞǿǿ ƥħǿǿŧǿǿş.}
            =1 {ǿǿƞḗḗ ƥħǿǿŧǿǿ.}
            other {# ƥħǿǿŧǿǿş.}}`;

    const result = pseudoTranslate(testMsg);
    expect(result).toBe(expectedMsg);
  });

  it('translates an ICU message with a {select}', () => {
    const test = oneLine`{taxableArea, select,
            yes {An additional {taxRate, number, percent} tax will be collected.}
            other {No taxes apply.}}`;

    const expected = oneLine`{taxableArea, select,
            yes {ȦȦƞ ȧȧḓḓīŧīǿǿƞȧȧŀ {taxRate, number, percent} ŧȧȧẋ ẇīŀŀ ƀḗḗ ƈǿǿŀŀḗḗƈŧḗḗḓ.}
            other {Ƞǿǿ ŧȧȧẋḗḗş ȧȧƥƥŀẏ.}}`;

    const result = pseudoTranslate(test);
    expect(result).toBe(expected);
  });

  it('translates an ICU message with a {selectordinal}', () => {
    const test = oneLine`It's my cat's {year, selectordinal,
            one {#st}
            two {#nd}
            few {#rd}
            other {#th}} birthday!`;

    const expected = oneLine`Īŧ'ş ḿẏ ƈȧȧŧ'ş {year, selectordinal,
            one {#şŧ}
            two {#ƞḓ}
            few {#řḓ}
            other {#ŧħ}} ƀīřŧħḓȧȧẏ!`;

    const result = pseudoTranslate(test);
    expect(result).toBe(expected);
  });

  it('translates this crazy ICU message', () => {
        // from here: http://userguide.icu-project.org/formatparse/messages
    const test = oneLine`
            {gender_of_host, select,
                female {{num_guests, plural, offset:1
                        =0 {{host} does not give a party.}
                        =1 {{host} invites {guest} to her party.}
                        =2 {{host} invites {guest} and one other person to her party.}
                        other {{host} invites {guest} and # other people to her party.}}}
                male {{num_guests, plural, offset:1
                        =0 {{host} does not give a party.}
                        =1 {{host} invites {guest} to his party.}
                        =2 {{host} invites {guest} and one other person to his party.}
                        other {{host} invites {guest} and # other people to his party.}}}
                other {{num_guests, plural, offset:1
                        =0 {{host} does not give a party.}
                        =1 {{host} invites {guest} to their party.}
                        =2 {{host} invites {guest} and one other person to their party.}
                        other {{host} invites {guest} and # other people to their party.}}}}`;

    const expected = oneLine`
            {gender_of_host, select,
                female {{num_guests, plural, offset:1,
                        =0 {{host} ḓǿǿḗḗş ƞǿǿŧ ɠīṽḗḗ ȧȧ ƥȧȧřŧẏ.}
                        =1 {{host} īƞṽīŧḗḗş {guest} ŧǿǿ ħḗḗř ƥȧȧřŧẏ.}
                        =2 {{host} īƞṽīŧḗḗş {guest} ȧȧƞḓ ǿǿƞḗḗ ǿǿŧħḗḗř ƥḗḗřşǿǿƞ ŧǿǿ ħḗḗř ƥȧȧřŧẏ.}
                        other {{host} īƞṽīŧḗḗş {guest} ȧȧƞḓ # ǿǿŧħḗḗř ƥḗḗǿǿƥŀḗḗ ŧǿǿ ħḗḗř ƥȧȧřŧẏ.}}}
                male {{num_guests, plural, offset:1,
                        =0 {{host} ḓǿǿḗḗş ƞǿǿŧ ɠīṽḗḗ ȧȧ ƥȧȧřŧẏ.}
                        =1 {{host} īƞṽīŧḗḗş {guest} ŧǿǿ ħīş ƥȧȧřŧẏ.}
                        =2 {{host} īƞṽīŧḗḗş {guest} ȧȧƞḓ ǿǿƞḗḗ ǿǿŧħḗḗř ƥḗḗřşǿǿƞ ŧǿǿ ħīş ƥȧȧřŧẏ.}
                        other {{host} īƞṽīŧḗḗş {guest} ȧȧƞḓ # ǿǿŧħḗḗř ƥḗḗǿǿƥŀḗḗ ŧǿǿ ħīş ƥȧȧřŧẏ.}}}
                other {{num_guests, plural, offset:1,
                        =0 {{host} ḓǿǿḗḗş ƞǿǿŧ ɠīṽḗḗ ȧȧ ƥȧȧřŧẏ.}
                        =1 {{host} īƞṽīŧḗḗş {guest} ŧǿǿ ŧħḗḗīř ƥȧȧřŧẏ.}
                        =2 {{host} īƞṽīŧḗḗş {guest} ȧȧƞḓ ǿǿƞḗḗ ǿǿŧħḗḗř ƥḗḗřşǿǿƞ ŧǿǿ ŧħḗḗīř ƥȧȧřŧẏ.}
                        other {{host} īƞṽīŧḗḗş {guest} ȧȧƞḓ # ǿǿŧħḗḗř ƥḗḗǿǿƥŀḗḗ ŧǿǿ ŧħḗḗīř ƥȧȧřŧẏ.}}}}`;

    const result = pseudoTranslate(test);
    expect(result).toBe(expected);
  });
});
