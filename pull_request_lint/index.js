const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs')
const path = require("path")
const https = require('https');
const spellcheck = require('markdown-spellcheck');

async function run() {
  try {
      const spelling_file_url = core.getInput('spelling-file-url');
      const spelling_list = core.getInput('spelling-list')

      const dictionary_path = path.join(__dirname, 'dictionaries', 'en_US');
      const fallback_spelling_path = path.join(__dirname, 'fallback.spelling');
      const downloaded_spelling_path = path.join(__dirname, 'downloaded.spelling');
      const pull_request_title = github.context.payload.pull_request.title;
      const file_to_spellcheck  = "pull_request.title";
      const spellcheck_options = {
        ignoreAcronyms: true,
        ignoreNumbers: true,
        suggestions: false,
        relativeSpellingFiles: true,
        dictionary: {
            language: "en-us", 
            file: `${dictionary_path}`}
        }

        fs.writeFileSync(file_to_spellcheck, pull_request_title);
        var spelling_path = fallback_spelling_path;

        try {
            await downloadFile(spelling_file_url, downloaded_spelling_path);
            spelling_path = downloaded_spelling_path;
            console.info(`Successfully downloaded .spelling file from ${spelling_file_url}`)
        } catch (error) {
            core.notice(`Can not download .spelling file from ${spelling_file_url}.\nFallback .spelling will be used.\nError: ${error}`);
        }

        extendDictionarySpelling(dictionary_path, spelling_path, spelling_list);

        const result = spellcheck.default.spellFile(file_to_spellcheck, spellcheck_options);

        if (result.errors.length) {
            core.setFailed(`${formatErrorMessage(result.errors, pull_request_title)}`);
        } else {
            core.info(`Text "${pull_request_title}\" is free from spelling errors`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

function extendDictionarySpelling(dictionary_path, spelling_path, spelling_list){
    try {
        const spelling_from_file_to_add = fs.readFileSync(spelling_path, 'utf8')
        fs.appendFileSync(`${dictionary_path}.dic`, spelling_from_file_to_add);

        if(spelling_list) {
            var spelling_from_list_to_add = spelling_list.split(/\s+/).join('\n');
            fs.appendFileSync(`${dictionary_path}.dic`, spelling_from_list_to_add);
        }

      } catch (error) {
        console.error(err)
      }
}

function formatErrorMessage(errors, text) {
    var message = `${errors.length} spelling errors found in "${text}":\n`;
    for (var i = 0; i < errors.length; i++) {
        message += `${i+1}) \"${errors[i].word}\" at index: ${errors[i].index} \n`;
    }

    return message;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest, { flags: "wx" });

      const request = https.get(url, response => {
          if (response.statusCode === 200) {
              response.pipe(file);
          } else {
              file.close();
              fs.unlink(dest, () => {});
              reject(`Response ${response.statusCode}: ${response.statusMessage}`);
          }
      });

      request.on("error", err => {
          file.close();
          fs.unlink(dest, () => {});
          reject(err.message);
      });

      file.on("finish", () => {
          resolve();
      });

      file.on("error", err => {
          file.close();
          fs.unlink(dest, () => {});
          reject(err.message);
      });
  });
}

run();