import LinkLibrary from './links';

var hamletLinkLibrary = require('linkify-it')();


Object.entries(LinkLibrary).map((entry) => {
    let keyword,value = entry;
    hamletLinkLibrary.add(keyword, {
        validate: '^ ' + keyword,
        normalize: function (match) {
            match.url = value;
        }
    });
});
