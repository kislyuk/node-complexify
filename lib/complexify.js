// @module complexify
'use strict'
var _ = require('underscore');

// @callback evalPasswordComplexityCallback
// @param {string} err - error code if an error occurs, null otherwise
// @param {boolean} valid - straight boolean to determine whether the password is valid or not given the supplied complexity params
// @param {number} complexity - complexity score for the password scaled according to strengthScaleFactor (0-100% is default)

var DEFAULT_BAN_LIST = '123456|password|12345678|1234|pussy|12345|dragon|qwerty|696969|mustang|letmein|baseball|master|michael|football|shadow|monkey|abc123|pass|fuckme|6969|jordan|harley|ranger|iwantu|jennifer|hunter|fuck|2000|test|batman|trustno1|thomas|tigger|robert|access|love|buster|1234567|soccer|hockey|killer|george|sexy|andrew|charlie|superman|asshole|fuckyou|dallas|jessica|panties|pepper|1111|austin|william|daniel|golfer|summer|heather|hammer|yankees|joshua|maggie|biteme|enter|ashley|thunder|cowboy|silver|richard|fucker|orange|merlin|michelle|corvette|bigdog|cheese|matthew|121212|patrick|martin|freedom|ginger|blowjob|nicole|sparky|yellow|camaro|secret|dick|falcon|taylor|111111|131313|123123|bitch|hello|scooter|please|porsche|guitar|chelsea|black|diamond|nascar|jackson|cameron|654321|computer|amanda|wizard|xxxxxxxx|money|phoenix|mickey|bailey|knight|iceman|tigers|purple|andrea|horny|dakota|aaaaaa|player|sunshine|morgan|starwars|boomer|cowboys|edward|charles|girls|booboo|coffee|xxxxxx|bulldog|ncc1701|rabbit|peanut|john|johnny|gandalf|spanky|winter|brandy|compaq|carlos|tennis|james|mike|brandon|fender|anthony|blowme|ferrari|cookie|chicken|maverick|chicago|joseph|diablo|sexsex|hardcore|666666|willie|welcome|chris|panther|yamaha|justin|banana|driver|marine|angels|fishing|david|maddog|hooters|wilson|butthead|dennis|fucking|captain|bigdick|chester|smokey|xavier|steven|viking|snoopy|blue|eagles|winner|samantha|house|miller|flower|jack|firebird|butter|united|turtle|steelers|tiffany|zxcvbn|tomcat|golf|bond007|bear|tiger|doctor|gateway|gators|angel|junior|thx1138|porno|badboy|debbie|spider|melissa|booger|1212|flyers|fish|porn|matrix|teens|scooby|jason|walter|cumshot|boston|braves|yankee|lover|barney|victor|tucker|princess|mercedes|5150|doggie|zzzzzz|gunner|horney|bubba|2112|fred|johnson|xxxxx|tits|member|boobs|donald|bigdaddy|bronco|penis|voyager|rangers|birdie|trouble|white|topgun|bigtits|bitches|green|super|qazwsx|magic|lakers|rachel|slayer|scott|2222|asdf|video|london|7777|marlboro|srinivas|internet|action|carter|jasper|monster|teresa|jeremy|11111111|bill|crystal|peter|pussies|cock|beer|rocket|theman|oliver|prince|beach|amateur|7777777|muffin|redsox|star|testing|shannon|murphy|frank|hannah|dave|eagle1|11111|mother|nathan|raiders|steve|forever|angela|viper|ou812|jake|lovers|suckit|gregory|buddy|whatever|young|nicholas|lucky|helpme|jackie|monica|midnight|college|baby|cunt|brian|mark|startrek|sierra|leather|232323|4444|beavis|bigcock|happy|sophie|ladies|naughty|giants|booty|blonde|fucked|golden|0|fire|sandra|pookie|packers|einstein|dolphins|chevy|winston|warrior|sammy|slut|8675309|zxcvbnm|nipples|power|victoria|asdfgh|vagina|toyota|travis|hotdog|paris|rock|xxxx|extreme|redskins|erotic|dirty|ford|freddy|arsenal|access14|wolf|nipple|iloveyou|alex|florida|eric|legend|movie|success|rosebud|jaguar|great|cool|cooper|1313|scorpio|mountain|madison|987654|brazil|lauren|japan|naked|squirt|stars|apple|alexis|aaaa|bonnie|peaches|jasmine|kevin|matt|qwertyui|danielle|beaver|4321|4128|runner|swimming|dolphin|gordon|casper|stupid|shit|saturn|gemini|apples|august|3333|canada|blazer|cumming|hunting|kitty|rainbow|112233|arthur|cream|calvin|shaved|surfer|samson|kelly|paul|mine|king|racing|5555|eagle|hentai|newyork|little|redwings|smith|sticky|cocacola|animal|broncos|private|skippy|marvin|blondes|enjoy|girl|apollo|parker|qwert|time|sydney|women|voodoo|magnum|juice|abgrtyu|777777|dreams|maxwell|music|rush2112|russia|scorpion|rebecca|tester|mistress|phantom|billy|6666|albert|111111|11111111|112233|121212|123123|123456|1234567|12345678|131313|232323|654321|666666|696969|777777|7777777|8675309|987654|abcdef|password1|password12|password123|twitter'.split('|');
var MIN_COMPLEXITY = 49; // 12 chars with Upper, Lower and Number
var MAX_COMPLEXITY = 120; //  25 chars, all charsets
var CHARSETS = [
    // Commonly Used
    ////////////////////
    [0x0030, 0x0039], // Numbers
    [0x0041, 0x005A], // Uppercase
    [0x0061, 0x007A], // Lowercase
    [0x0021, 0x002F], // Punctuation
    [0x003A, 0x0040], // Punctuation
    [0x005B, 0x0060], // Punctuation
    [0x007B, 0x007E], // Punctuation
    // Everything Else
    ////////////////////
    [0x0080, 0x00FF], // Latin-1 Supplement
    [0x0100, 0x017F], // Latin Extended-A
    [0x0180, 0x024F], // Latin Extended-B
    [0x0250, 0x02AF], // IPA Extensions
    [0x02B0, 0x02FF], // Spacing Modifier Letters
    [0x0300, 0x036F], // Combining Diacritical Marks
    [0x0370, 0x03FF], // Greek
    [0x0400, 0x04FF], // Cyrillic
    [0x0530, 0x058F], // Armenian
    [0x0590, 0x05FF], // Hebrew
    [0x0600, 0x06FF], // Arabic
    [0x0700, 0x074F], // Syriac
    [0x0780, 0x07BF], // Thaana
    [0x0900, 0x097F], // Devanagari
    [0x0980, 0x09FF], // Bengali
    [0x0A00, 0x0A7F], // Gurmukhi
    [0x0A80, 0x0AFF], // Gujarati
    [0x0B00, 0x0B7F], // Oriya
    [0x0B80, 0x0BFF], // Tamil
    [0x0C00, 0x0C7F], // Telugu
    [0x0C80, 0x0CFF], // Kannada
    [0x0D00, 0x0D7F], // Malayalam
    [0x0D80, 0x0DFF], // Sinhala
    [0x0E00, 0x0E7F], // Thai
    [0x0E80, 0x0EFF], // Lao
    [0x0F00, 0x0FFF], // Tibetan
    [0x1000, 0x109F], // Myanmar
    [0x10A0, 0x10FF], // Georgian
    [0x1100, 0x11FF], // Hangul Jamo
    [0x1200, 0x137F], // Ethiopic
    [0x13A0, 0x13FF], // Cherokee
    [0x1400, 0x167F], // Unified Canadian Aboriginal Syllabics
    [0x1680, 0x169F], // Ogham
    [0x16A0, 0x16FF], // Runic
    [0x1780, 0x17FF], // Khmer
    [0x1800, 0x18AF], // Mongolian
    [0x1E00, 0x1EFF], // Latin Extended Additional
    [0x1F00, 0x1FFF], // Greek Extended
    [0x2000, 0x206F], // General Punctuation
    [0x2070, 0x209F], // Superscripts and Subscripts
    [0x20A0, 0x20CF], // Currency Symbols
    [0x20D0, 0x20FF], // Combining Marks for Symbols
    [0x2100, 0x214F], // Letterlike Symbols
    [0x2150, 0x218F], // Number Forms
    [0x2190, 0x21FF], // Arrows
    [0x2200, 0x22FF], // Mathematical Operators
    [0x2300, 0x23FF], // Miscellaneous Technical
    [0x2400, 0x243F], // Control Pictures
    [0x2440, 0x245F], // Optical Character Recognition
    [0x2460, 0x24FF], // Enclosed Alphanumerics
    [0x2500, 0x257F], // Box Drawing
    [0x2580, 0x259F], // Block Elements
    [0x25A0, 0x25FF], // Geometric Shapes
    [0x2600, 0x26FF], // Miscellaneous Symbols
    [0x2700, 0x27BF], // Dingbats
    [0x2800, 0x28FF], // Braille Patterns
    [0x2E80, 0x2EFF], // CJK Radicals Supplement
    [0x2F00, 0x2FDF], // Kangxi Radicals
    [0x2FF0, 0x2FFF], // Ideographic Description Characters
    [0x3000, 0x303F], // CJK Symbols and Punctuation
    [0x3040, 0x309F], // Hiragana
    [0x30A0, 0x30FF], // Katakana
    [0x3100, 0x312F], // Bopomofo
    [0x3130, 0x318F], // Hangul Compatibility Jamo
    [0x3190, 0x319F], // Kanbun
    [0x31A0, 0x31BF], // Bopomofo Extended
    [0x3200, 0x32FF], // Enclosed CJK Letters and Months
    [0x3300, 0x33FF], // CJK Compatibility
    [0x3400, 0x4DB5], // CJK Unified Ideographs Extension A
    [0x4E00, 0x9FFF], // CJK Unified Ideographs
    [0xA000, 0xA48F], // Yi Syllables
    [0xA490, 0xA4CF], // Yi Radicals
    [0xAC00, 0xD7A3], // Hangul Syllables
    [0xD800, 0xDB7F], // High Surrogates
    [0xDB80, 0xDBFF], // High Private Use Surrogates
    [0xDC00, 0xDFFF], // Low Surrogates
    [0xE000, 0xF8FF], // Private Use
    [0xF900, 0xFAFF], // CJK Compatibility Ideographs
    [0xFB00, 0xFB4F], // Alphabetic Presentation Forms
    [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
    [0xFE20, 0xFE2F], // Combining Half Marks
    [0xFE30, 0xFE4F], // CJK Compatibility Forms
    [0xFE50, 0xFE6F], // Small Form Variants
    [0xFE70, 0xFEFE], // Arabic Presentation Forms-B
    [0xFEFF, 0xFEFF], // Specials
    [0xFF00, 0xFFEF], // Halfwidth and Fullwidth Forms
    [0xFFF0, 0xFFFD]  // Specials
];


// Array of banned passwords generated from 500 worst passwords and 370 Banned Twitter lists
// @property defaultBanList
// @source http://www.skullsecurity.org/wiki/index.php/Passwords
// 
exports.defaultBanList = DEFAULT_BAN_LIST;

// Evaluates the supplied password and returns it's complexity score. 
// @method evalPasswordComplexity
// @param {string} password - The password to be evaluated
// @param {object} [options] - Options that modify the password complexity checking
// @param {integer} [options.minimumChars=8] - Minimum number of characters in the password.
// @param {number} [options.minimumComplexity=49] - Minimum complexity in order to be considered to be valid. Complexify's default settings will enforce a minimum level of complexity that would mean brute-forcing should take ~600 years on a commodity desktop machine.
// @param {integer} [options.strengthScaleFactor=1] - Scale value for the complexity score (1 is equivalent to a percentage between 0-100%)
// @param {string[]} [options.bannedPasswords={defaultBanList}] - Array of banned passwords
// @param {string} [options.banMode='loose'] - 'strict' will match on the substrings within the banned passwords, 'loose' will only match on the whole word, 'none' will not used the banned list 
// @param {evalPasswordComplexityCallback} callback - Callback to be called when the complexity check is complete. 
// @returns {any} Returns the result of the supplied callback back to the calling function.
//
exports.evalPasswordComplexity = function(password, options, callback) {
    // Process defaults
    var defaults = {
        minimumChars: 8,                            // minimum number of characters in the password
        minimumComplexity: MIN_COMPLEXITY,
        strengthScaleFactor: 1,                     // how to scale the resulting complexity score
        bannedPasswords: DEFAULT_BAN_LIST,          // array of banned words
        banMode: 'loose'                           // (strict|loose|none)
    };
    
    if (typeof options == 'function' && !callback) {
        callback = options;
        options = {};
    }
    
    // Set the defaults
    options = _.pick(options, _.keys(defaults));
    options = _.defaults(options, defaults);
    
    // @function additionaComplexityForCharset
    // @param {string} str - password to check
    // @param {integer[]} charset - pair of integers reprenting a range of unicode characters
    // @returns {integer } complexity score based on size of charset
    // @private
    function additionalComplexityForCharset(str, charset) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
                return charset[1] - charset[0] + 1;
            }
        }
        return 0;
    }

    // @function inBanlist
    // @param {string} str - determines whether the supplied string is in the banlist 
    // @param {string[]} bannedPasswords - Array of banned passwords
    // @param {string} banMode - 'strict' will match on the substrings within the banned passwords, 'loose' will only match on the whole word, 'none' will not used the banned list 
    // @returns {boolean} true if password is in the ban list, false otherwise
    // @private
    function inBanlist(str, bannedPasswords, banMode) {
        if (bannedPasswords.length == 0 || banMode == 'none') 
            return false;

        for (var i = 0; i < bannedPasswords.length; i++) {
            if (banMode === 'strict') {
                if (bannedPasswords[i].indexOf(str) !== -1) {
                    console.log("Strict ban: " + bannedPasswords[i]);
                    return true;
                }
            } else {
                if (bannedPasswords[i] === str) {
                    console.log("Loose ban: " + bannedPasswords[i]);
                    return true;
                }
            }
        }
        return false;
    }

    var complexity = 0, valid = false;
    var error = [];

    if (!inBanlist(password, options.bannedPasswords, options.banMode)) {
        for (var i = CHARSETS.length - 1; i >= 0; i--) {
            complexity += additionalComplexityForCharset(password, CHARSETS[i]);
        }
    } else {
        error.push("banned");
    }
    
    // Use natural log to produce linear scale
    complexity = Math.log(Math.pow(complexity, password.length)) * (1 / options.strengthScaleFactor);
    console.log("Unscaled complexity: " + complexity);

    // Check if complexity meets minimum and password is long enough
    if (complexity < options.minimumComplexity)
        error.push("toosimple");
    if (password.length < options.minimumChars)
        error.push("tooshort");

    // Scale to percentage, so it can be used for a progress bar
    complexity = (complexity / MAX_COMPLEXITY) * 100;
    complexity = (complexity > 100) ? 100 : complexity;

    return callback(error.length == 0 ? null : error, error.length == 0, complexity);
}
