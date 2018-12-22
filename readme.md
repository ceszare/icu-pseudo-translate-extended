# icu-pseudo-translate-extended

This tool converts messages written in the [ICU message format](http://userguide.icu-project.org/formatparse/messages) into messages written with [pseudo-localized](https://docs.microsoft.com/en-us/windows/desktop/intl/pseudo-locales) content. As detailed by [Netflix](https://medium.com/netflix-techblog/pseudo-localization-netflix-12fff76fbcbe), using pseudo-localization on our strings will bring in several benefits such as:
- Allowing developers to easily find strings that have not been localized.
- Expose rendering errors when handling non-traditional alphabets.
- Allowing developers to test how their text will be displayed in right-to-left languages.
- Allowing developers to expand the length of strings, helping them catch any layout issues with lengthy strings.

This tool is an extension of [1stdibs](https://github.com/1stdibs) [icu-pseudo-translate utility](https://github.com/1stdibs/icu-pseudo-translate) implementation. Whereas the original tool only replaced strings from the English alphabet, this fork uses [Tryggvi Gylfason's](https://github.com/tryggvigy) [pseudo-localization engine](https://github.com/tryggvigy/pseudo-localization), allowing us more configuration options for generating the pseudo-localized strings.

## Example

## Installing

### NPM

```
npm install icu-pseudo-translate-extended
```

### Yarn

```
yarn add icu-pseudo-translate-extended
```

## Using the utility

Import or require the module:

```javascript
import translate from 'icu-pseudo-translate-extended';
```

or

```javascript
const translate = require('icu-pseudo-translate-extended');
```

Then, you can just use the translate function by passing the string to translate, and optionally a flag which determines if the content should be displayed bi-directionally:

```javascript
const strintToTranslate = 'On {takenDate, date, short} {name} took {numPhotos, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}';
const defaultTranslation = translate(stringToTranslate); // same as translate(stringToTranslate, false);
const bidirectionalTranslation = translate(stringToTranslate, true);
```

## Authors

* **Cesar Zapata** - *Initial work* - [Ceszare](https://github.com/Ceszare)

See also the list of [contributors](https://github.com/ceszare/icu-pseudo-translate-extended/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments
* [Tim Whidden](https://github.com/twhid) and [1stdibs](https://github.com/1stdibs) for their [icu-pseudo-translate](https://github.com/1stdibs/icu-pseudo-translate) utility
* [Tryggvi Gylfason](https://github.com/tryggvigy) for his amazing [pseudo-localization](https://github.com/tryggvigy/pseudo-localization) engine.
