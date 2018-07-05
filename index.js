const fetch = require('node-fetch');
const execa = require('execa');
const Listr = require('listr');
const argv = require('minimist')(process.argv.slice(2));
const lessonsUrl = argv['url'];

if (!argv['url'] || typeof argv['url'] === 'boolean') {
    console.log('You haven\'t specify an egghead url')
} else {
    fetch(`https://egghead.io/api/v1/series/${lessonsUrl.substring('https://egghead.io/courses/'.length)}/lessons`)
        .then((response) => {
            return response.json();
        })
        .then(lessons => {
            const vidList = lessons
                .map((lesson) => lesson.http_url)
                .map((vid, idx) => {
                    return {
                        title: `${idx}. ${vid}`,
                        task: () => execa('youtube-dl', [vid])
                    }
                });
            new Listr(vidList).run();
        });
}